const taskForm = document.getElementById('task-form');
const confirmCloseDialog = document.getElementById('confirm-close-dialog');
const openTaskFormBtn = document.getElementById('open-task-form-btn');
const closeTaskFormBtn = document.getElementById('close-task-form-btn');
const addOrUpdateTaskBtn = document.getElementById('add-or-update-task-btn');
const cancelBtn = document.getElementById('cancel-btn');
const discardBtn = document.getElementById('discard-btn');
const tasksContainer = document.getElementById('tasks-container');
const titleInput = document.getElementById('title-input');
const dateInput = document.getElementById('date-input');
const descriptionInput = document.getElementById('description-input');

// array for storing all tasks with their associated data
// const taskData = [];
const taskData = JSON.parse(localStorage.getItem("data")) || [];

// object to track the state when editing/discarding tasks
let currentTask = {};

// functions
const addOrUpdateTask = () => {
    addOrUpdateTaskBtn.innerText = 'Add Task';
    const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    const taskObj = {
        id: `${titleInput.value.toLowerCase().split(' ').join('-')}-${Date.now()}`,
        title: titleInput.value,
        date: dateInput.value,
        description: descriptionInput.value
    };

    if (dataArrIndex === -1) {
        taskData.unshift(taskObj);
    } else {
        taskData[dataArrIndex] = taskObj;
    }

    localStorage.setItem("data", JSON.stringify(taskData));

    updateTaskContainer();
    reset();
};

const updateTaskContainer = () => {
    tasksContainer.innerHTML = '';

    taskData.forEach(
        ({ id, title, date, description }) => {
            (tasksContainer.innerHTML += `
            <div class="task" id="${id}">
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Description:</strong> ${description}</p>
              <button type="button" class="btn" onclick="editTask(this)">Edit</button>
              <button type="button" class="btn" onclick="deleteTask(this)">Delete</button>
            </div>
          `)
        }
    );
};

const deleteTask = (buttonEl) => {
    // dataArrIndex is the index start
    const dataArrIndex = taskData.findIndex((item) => item.id === buttonEl.parentElement.id);

    buttonEl.parentElement.remove();
    taskData.splice(dataArrIndex, 1);

    localStorage.setItem("data", JSON.stringify(taskData));
};

const editTask = (buttonEl) => {
    // dataArrIndex is the index start
    const dataArrIndex = taskData.findIndex((item) => item.id === buttonEl.parentElement.id);

    // task to be edited
    currentTask = taskData[dataArrIndex];

    // stage the task for editing
    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    descriptionInput.value = currentTask.description;

    addOrUpdateTaskBtn.innerText = 'Update Task';

    taskForm.classList.toggle('hidden');
};

// reset function
const reset = () => {
    titleInput.value = '';
    dateInput.value = '';
    descriptionInput.value = '';

    taskForm.classList.toggle('hidden');
    currentTask = {};
};

if(taskData.length) {
    updateTaskContainer();
}

// event listeners
openTaskFormBtn.addEventListener('click', () => {
    taskForm.classList.toggle('hidden');
});

closeTaskFormBtn.addEventListener('click', () => {
    const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;

    const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

    if (formInputsContainValues && formInputValuesUpdated) {
        confirmCloseDialog.showModal();
    } else {
        reset();
    }
});

cancelBtn.addEventListener('click', () => {
    confirmCloseDialog.close();
});

discardBtn.addEventListener('click', () => {
    confirmCloseDialog.close();
    reset();
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();   // stops browser from refreshing page after submitting form

    addOrUpdateTask();
});
