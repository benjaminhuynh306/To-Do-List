document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('new-task');
    const priorityInput = document.getElementById('priority');
    const taskList = document.getElementById('task-list');
    const addTaskButton = document.getElementById('add-task-button');

    console.log('Document loaded');  // Debugging output

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(function(taskItem) {
            const taskText = taskItem.querySelector('.task-text').textContent;
            const taskPriority = taskItem.dataset.priority;
            const taskCompleted = taskItem.classList.contains('completed');
            tasks.push({ text: taskText, priority: taskPriority, completed: taskCompleted });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(function(task) {
            addTask(task.text, task.priority, task.completed);
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

    // Sort tasks by priority (highest priority at the top)
    function sortTasks() {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => getPriorityRank(a.dataset.priority) - getPriorityRank(b.dataset.priority));
        tasks.forEach(task => taskList.appendChild(task));
    }

    // Add a new task to the list
    function addTask(text, priority, completed = false) {
        const taskItem = document.createElement('li');
        taskItem.dataset.priority = priority;
        taskItem.classList.add(`priority-${priority.toLowerCase()}`);
        if (completed) {
            taskItem.classList.add('completed');
        }

        const taskText = document.createElement('span');
        taskText.textContent = text;
        taskText.classList.add('task-text');
        taskItem.appendChild(taskText);

      

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
            if (event.target !== deleteButton) {
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
        console.log('Adding task:', taskText, taskPriority);  // Debugging output
        if (taskText) {
            addTask(taskText, taskPriority);
            taskInput.value = '';
        }
    }

    // Event listener for the "Add" button click
    addTaskButton.addEventListener('click', handleAddTask);

    // Event listener for pressing the "Enter" key in the task input field
    taskInput.addEventListener('keydown', function(event) {
        console.log('Key pressed:', event.key, event.keyCode);  // Debugging output
        if (event.key === 'Enter' || event.keyCode === 13) {
            console.log('Enter key detected');  // Debugging output
            handleAddTask();
        }
    });

    // Load and sort tasks on page load
    loadTasks();
    sortTasks();  // Ensure tasks are sorted after loading
});
