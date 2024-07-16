console.log('External script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');  // Debugging

    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

    if (toggleDarkModeButton) {
        console.log('Button found');
        toggleDarkModeButton.addEventListener('click', function() {
            console.log('Toggle Dark Mode button clicked');  // Debugging
            document.body.classList.toggle('dark-mode');
            console.log('Dark mode toggled');  // Debugging
        });
    } else {
        console.log('Button not found');
    }

    // Rest of your code
    const taskInput = document.getElementById('new-task');
    const dueDateInput = document.getElementById('due-date');
    const priorityInput = document.getElementById('priority');
    const categoryInput = document.getElementById('category');
    const taskList = document.getElementById('task-list');
    const addTaskButton = document.getElementById('add-task-button');

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(function(taskItem) {
            const taskText = taskItem.querySelector('.task-text').textContent;
            const taskPriority = taskItem.dataset.priority;
            const taskDueDate = taskItem.dataset.dueDate;
            const taskCategory = taskItem.dataset.category;
            const taskCompleted = taskItem.classList.contains('completed');
            tasks.push({ text: taskText, priority: taskPriority, dueDate: taskDueDate, category: taskCategory, completed: taskCompleted });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(function(task) {
            addTask(task.text, task.priority, task.dueDate, task.category, task.completed);
        });
    }

    // Assign numerical values to priorities for comparison
    function getPriorityRank(priority) {
        const ranks = {
            High: 1,
            Medium: 2,
            Low: 3
        };
        return ranks[priority];
    }

    // Sort tasks by priority and due date (highest priority and nearest due date at the top)
    function sortTasks() {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => {
            const priorityDifference = getPriorityRank(a.dataset.priority) - getPriorityRank(b.dataset.priority);
            if (priorityDifference !== 0) {
                return priorityDifference;
            }
            const dateA = new Date(a.dataset.dueDate);
            const dateB = new Date(b.dataset.dueDate);
            return dateA - dateB;
        });
        tasks.forEach(task => taskList.appendChild(task));
    }

    // Add a new task to the list
    function addTask(text, priority, dueDate, category, completed = false) {
        const taskItem = document.createElement('li');
        taskItem.dataset.priority = priority;
        taskItem.dataset.dueDate = dueDate;
        taskItem.dataset.category = category;
        taskItem.classList.add(`priority-${priority.toLowerCase()}`);
        if (completed) {
            taskItem.classList.add('completed');
        }

        const taskText = document.createElement('span');
        taskText.textContent = `${text} (Due: ${dueDate || 'No due date'}) [${category}]`;
        taskText.classList.add('task-text');
        taskItem.appendChild(taskText);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function() {
            const newText = prompt('Edit task:', taskText.textContent);
            if (newText) {
                taskText.textContent = newText;
                saveTasks();
                sortTasks(); // Sort after editing a task
            }
        });
        taskItem.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            taskList.removeChild(taskItem);
            saveTasks();
            sortTasks(); // Sort after deleting a task
        });
        taskItem.appendChild(deleteButton);

        taskItem.addEventListener('click', function(event) {
            if (event.target !== editButton && event.target !== deleteButton) {
                taskItem.classList.toggle('completed');
                saveTasks();
                sortTasks(); // Sort after marking a task as completed/incomplete
            }
        });

        taskList.appendChild(taskItem);
        saveTasks();
        sortTasks();  // Sort after adding a new task
    }

    // Function to handle adding a task (both button click and enter key)
    function handleAddTask() {
        const taskText = taskInput.value.trim();
        const taskPriority = priorityInput.value;
        const taskDueDate = dueDateInput.value;
        const taskCategory = categoryInput.value;
        if (taskText) {
            addTask(taskText, taskPriority, taskDueDate, taskCategory);
            taskInput.value = '';
            dueDateInput.value = '';
        }
    }

    // Event listener for the "Add" button click
    addTaskButton.addEventListener('click', handleAddTask);

    // Event listener for pressing the "Enter" key in the task input field
    taskInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            handleAddTask();
        }
    });

    // Load and sort tasks on page load
    loadTasks();
    sortTasks();  // Ensure tasks are sorted after loading
});
