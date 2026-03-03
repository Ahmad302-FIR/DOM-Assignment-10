// ==================== DOM Elements ====================
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');

// ==================== Local Storage Key ====================
const STORAGE_KEY = 'todoTasks';

// ==================== Tasks Array ====================
// Each task: { id: string, text: string, completed: boolean }
let tasks = [];

// ==================== Load Tasks from Local Storage (Task 5) ====================
function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
        try {
            tasks = JSON.parse(storedTasks);
        } catch (e) {
            tasks = [];
        }
    } else {
        tasks = [];
    }
    renderTasks();
}

// ==================== Save Tasks to Local Storage (Task 5) ====================
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ==================== Render All Tasks ====================
function renderTasks() {
    // Clear the current list
    taskList.innerHTML = '';

    // Loop through tasks and create list items (using forEach)
    tasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });
}

// ==================== Create a Single Task Element ====================
function createTaskElement(task) {
    const li = document.createElement('li'); // document.createElement()
    li.className = 'task-item';
    li.dataset.id = task.id;

    // Task text span
    const textSpan = document.createElement('span');
    textSpan.className = `task-text ${task.completed ? 'completed' : ''}`;
    textSpan.textContent = task.text;

    // Actions container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'action-btn edit-btn';

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'action-btn delete-btn';

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(textSpan);
    li.appendChild(actionsDiv);

    // --- Task 2: Mark as Completed (click on text) ---
    textSpan.addEventListener('click', () => {
        task.completed = !task.completed;               // toggle boolean
        // classList.toggle() would be used directly on element, but we re-render
        saveTasks();
        renderTasks();                                  // re-render to update class
    });

    // --- Task 3: Delete Individual Task ---
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();                            // prevent event bubbling
        // Use filter to remove the task
        tasks = tasks.filter(t => t.id !== task.id);    // Array.filter()
        saveTasks();
        renderTasks();
    });

    // --- Task 4: Edit Task ---
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        // Replace content with input field and save button
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'task-edit-input';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'action-btn save-btn';

        // Clear li and append new elements
        li.innerHTML = '';
        li.appendChild(input);
        li.appendChild(saveBtn);

        // Focus input for immediate typing
        input.focus();

        // Save on button click
        saveBtn.addEventListener('click', () => {
            const newText = input.value.trim();
            if (newText !== '') {
                task.text = newText;
                saveTasks();
                renderTasks();
            }
        });

        // Save on Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            }
        });
    });

    return li;
}

// ==================== Task 1: Add New Task ====================
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Task cannot be empty!');
        return;
    }

    // Create new task object with unique id
    const newTask = {
        id: Date.now().toString(),      // simple unique id
        text: text,
        completed: false
    };

    tasks.push(newTask);                // add to array
    saveTasks();                        // save to localStorage
    renderTasks();                      // update DOM

    // Clear input field
    taskInput.value = '';
}

// ==================== Task 6: Clear All Tasks ====================
function clearAllTasks() {
    if (tasks.length === 0) return;     // nothing to clear

    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];                      // empty the array
        localStorage.removeItem(STORAGE_KEY); // clear from localStorage
        renderTasks();                    // update DOM (list becomes empty)
    }
}

// ==================== Event Listeners ====================
addBtn.addEventListener('click', addTask);                // Task 1
clearAllBtn.addEventListener('click', clearAllTasks);     // Task 6

// Allow pressing Enter to add task (optional, but user-friendly)
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// ==================== Initialize on Page Load ====================
document.addEventListener('DOMContentLoaded', loadTasks);  // Task 5 (load from storage)