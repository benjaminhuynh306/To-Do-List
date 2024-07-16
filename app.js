document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('new-task');
    const priorityInput = document.getElementById('priority');
    const taskList = document.getElementById('task-list');
    const addTaskButton = document.getElementById('add-task-button');

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

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(function(task) {
            addTask(task.text, task.priority, task.completed);
        });
    }
    function getPriorityRank(priority) {
        const ranks = {
            High: 1,
            Medium: 2,
            Low: 3
        };
        return ranks[priority];
    }
    function sortTasks() { //Sorts the tasks based on priority using getPriorityRank
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => getPriorityRank(a.dataset.priority) - getPriorityRank(b.dataset.priority));
        tasks.forEach(task => taskList.appendChild(task));
    }

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

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function() {
            taskInput.value = taskText.textContent;
            priorityInput.value = priority;
            taskList.removeChild(taskItem);
            saveTasks();
            sortTasks(); 
        });
        taskItem.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            taskList.removeChild(taskItem);
            saveTasks();
        });
        taskItem.appendChild(deleteButton);

        taskItem.addEventListener('click', function(event) {
            if (event.target !== editButton && event.target !== deleteButton) {
                taskItem.classList.toggle('completed');
                saveTasks();
            }
        });

        taskList.appendChild(taskItem);
        saveTasks();
        sortTasks();
    }

    addTaskButton.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        const taskPriority = priorityInput.value;
        if (taskText) {
            addTask(taskText, taskPriority);
            taskInput.value = '';
        }
    });

    loadTasks();
    sortTasks();
});
