let contactList = [];
let selectedUsers = [];
let currentPrio = 'medium';
let currentLabel = '';
let subtasksArray = [];
let tasks = [];

/**
 * Initializes the process of adding a new task.
 * 
 * @returns {Promise<void>} A Promise that resolves after initialization.
 */
async function initAddTask() {
    await init();
    loadContactList();
    renderSubtask();
    setDueDateInput();
}

/**
 * Loads the contact list from local storage and renders it for tasks.
 * 
 * @returns {Promise<void>} A Promise that resolves after loading and rendering the contact list.
 */
async function loadContactList() {
    try {
        contactList = JSON.parse(await getItem('contactList'));
        renderContactListForTask();
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Renders the contact list for tasks.
 */
function renderContactListForTask() {
    document.getElementById('add-task-contact').innerHTML = '';
    for (let i = 0; i < contactList.length; i++) {
        let contact = contactList[i].name;
        const name = contact.split(" ");
        const firstName = name[0][0];
        const secondName = name[1] ? name[1][0] : '';
        let initials = firstName + secondName;
        document.getElementById('add-task-contact').innerHTML += renderContactListForTaskHTML(i, secondName, initials, contact);
    }
}

/**
 * Filters and renders contacts for adding tasks based on the input value.
 */
async function filterContactsForAddTask() {
    document.getElementById('add-task-contact').innerHTML = '';
    let value = document.getElementById('add-task-assignet-to').value.toLowerCase();
    for (let i = 0; i < contactList.length; i++) {
        let checkContact = contactList[i].name.toLowerCase();
        filterContactsForAddTaskIF(i, value,contactList, checkContact);
    }
}

/**
 * Toggles the visibility of a dropdown menu.
 * 
 * @param {string} divID - The ID of the dropdown menu container.
 * @param {string} arrow - The ID of the arrow indicating the dropdown state.
 */
function dropdownMenuToggle(divID, arrow) {
    let dNone = document.getElementById(`${divID}`).classList.contains('d-none');
    document.getElementById(`${arrow}`);
    dropdownMenuToggleIF(divID, arrow, dNone)
}

/**
 * Opens a dropdown menu and rotates the arrow to indicate the open state.
 * 
 * @param {string} divID - The ID of the dropdown menu container.
 * @param {string} arrow - The ID of the arrow indicating the dropdown state.
 */
function openDropdownMenu(divID, arrow) {
    document.getElementById(`${divID}`).classList.remove('d-none');
    document.getElementById(`${arrow}`).style = "transform: rotate(180deg);"
}

/**
 * Closes a dropdown menu and resets the arrow rotation to its initial state.
 * 
 * @param {string} divID - The ID of the dropdown menu container.
 * @param {string} arrow - The ID of the arrow indicating the dropdown state.
 */
function closeDropdownMenu(divID, arrow) {
    document.getElementById(`${divID}`).classList.add('d-none');
    document.getElementById(`${arrow}`).style = "transform: rotate(0);"
}

/**
 * Selects or deselects a contact based on its index and updates the list of selected users.
 * 
 * @param {number} i - The index of the contact.
 */
function selectContact(i) {
    let get = document.getElementById(`add-task-assignet-checkbox${i}`);
    let unchecked = `<use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>`;
    let checked = `<use href="assets/img/icons.svg#checkbox-checked-icon"></use>`;
    let user = contactList[i].name;
    selectContactIF(i, get, unchecked, checked, user);
    updateSelectedUsers(i);
}

/**
 * Updates the list of selected users and renders their initials.
 * 
 * @param {number} i - The index of the contact.
 */
function updateSelectedUsers(i) {
    let contactsDiv = document.getElementById('contacts-div');
    contactsDiv.innerHTML = '';
    selectedUsers.forEach((selectedUser, index) => {
        let nameParts = selectedUser.split(" ");
        let initials = nameParts.map(part => part[0]).join('');
        let secondName = nameParts[1] ? nameParts[1][0].toLowerCase() : '';
        contactsDiv.innerHTML += /*html*/`
            <div class="name-div selected-initials">
                <span class="initials letter-${secondName}">${initials}</span>
            </div>
        `;
    });
}

/**
 * Sets the minimum date for the due date input field to today's date.
 */
function setDueDateInput() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('add-task-date').setAttribute('min', today);
}

/**
 * Changes the priority of the task based on the provided priority level.
 * 
 * @param {string} prio - The priority level ('urgent', 'medium', or 'low').
 */
function changePriority(prio) {
    let urgent = document.getElementById('prio-button-urgent');
    let medium = document.getElementById('prio-button-medium');
    let low = document.getElementById('prio-button-low');
    changePriorityIF(prio, urgent, medium, low);
}

/**
 * Retrieves the label for the task from the input field and closes the label dropdown menu.
 */
function typeLabel() {
    currentLabel = document.getElementById('add-task-category').value;
    closeDropdownMenu('add-task-category-list-div', 'category-arrow');
}

/**
 * Selects a label for the task and updates the current label value. Closes the label dropdown menu.
 * 
 * @param {string} label - The label to be selected.
 */
function selectLabel(label) {
    document.getElementById('add-task-category').value = `${label}`;
    currentLabel = document.getElementById('add-task-category').value;
    closeDropdownMenu('add-task-category-list-div', 'category-arrow');
}

/**
 * Renders the list of subtasks in the UI.
 */
function renderSubtask() {
    let subtasks = document.getElementById('subtask-container');
    subtasks.innerHTML = '';
    for (let i = 0; i < subtasksArray.length; i++) {
        const subtask = subtasksArray[i].task;
        subtasks.innerHTML += renderSubtaskHTML(i, subtask);
    }
}

/**
 * Handles the Enter key event.
 * 
 * @param {Event} event - The key event.
 */
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        event.target.blur();
        addSubtask();
    }
}

/**
 * Adds a subtask to the list of subtasks.
 */
function addSubtask() {
    let subtaskInput = document.getElementById('add-task-subtasks')
    let subtaskInputArray = {
        'task': subtaskInput.value,
        'done': false,
    };
    addSubtaskIF(subtaskInput, subtaskInputArray);
}

/**
 * Closes the subtask input and clears its value.
 */
function closeSubtask() {
    document.getElementById('subbtask-input-icon').innerHTML = closeSubtaskHTML();
    document.getElementById('add-task-subtasks').value = '';
}

/**
 * Opens the subtask input for adding a new subtask.
 */
function openSubtask() {
    document.getElementById('subbtask-input-icon').innerHTML = openSubtaskHTML();
    document.getElementById("add-task-subtasks").focus();
}

/**
 * Displays edit and delete buttons for a subtask when hovered over.
 * 
 * @param {number} i - The index of the subtask.
 */
function subtaskEditButtonsOn(i) {
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = editSubtaskHTML(i);
};

/**
 * Hides edit and delete buttons for a subtask when not hovered over.
 * 
 * @param {number} i - The index of the subtask.
 */
function subtaskEditButtonsOut(i) {
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = '';
};

/**
 * Listens for clicks outside of a specific element and handles the event accordingly.
 * 
 * @param {HTMLElement} element - The HTML element to check for clicks outside.
 * @param {number} i - The index of the subtask.
 */
function onClickOutside(element, i) {
    document.addEventListener('click', e => {
        onClickOutsideIF(element, i, e);
    });
}

/**
 * Starts listening for clicks outside of a specific subtask element and handles the event accordingly.
 * 
 * @param {number} i - The index of the subtask.
 */
function startOnClickOutside(i) {
    const myElement = document.getElementById(`single-subtask${i}`);
    onClickOutside(myElement, i);
}

/**
 * Focuses on a specific subtask for editing.
 * 
 * @param {number} i - The index of the subtask to focus on.
 */
function focusSubtask(i) {
    document.getElementById(`single-subtask${i}`).removeAttribute('onmouseenter');
    document.getElementById(`single-subtask${i}`).removeAttribute('onmouseleave');
    document.getElementById('body').setAttribute('onclick', `closeFunction(); startOnClickOutside(${i})`)
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = focusSubtaskHTML(i);
    document.getElementById(`single-subtask-txt${i}`).focus();
    document.getElementById(`single-subtask${i}`).classList.add('subbtask-on-focus');
    document.getElementById(`single-subtask${i}`).classList.remove('subbtask-hover');
}

/**
 * Focuses on a specific subtask from the board for editing.
 * 
 * @param {number} i - The index of the subtask to focus on.
 */
function focusSubtaskfromBoard() {
    document.getElementById(`single-subtask${i}`).removeAttribute('onmouseenter');
    document.getElementById(`single-subtask${i}`).removeAttribute('onmouseleave');
    document.getElementById('main-div').setAttribute('onclick', `closeFunction(); startOnClickOutside(${i})`)
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = focusSubtaskHTML(i);
    document.getElementById(`single-subtask-txt${i}`).focus();
    document.getElementById(`single-subtask${i}`).classList.add('subbtask-on-focus');
    document.getElementById(`single-subtask${i}`).classList.remove('subbtask-hover');
}

/**
 * Edits a subtask by updating its content and re-rendering the subtask.
 * 
 * @param {number} i - The index of the subtask to edit.
 */
function editSubtask(i) {
    const subtask = subtasksArray[i];
    subtasksArray.splice(i, 1, document.getElementById(`single-subtask-txt${i}`).innerHTML);
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = editSubtaskHTML(i);
    document.getElementById(`single-subtask${i}`).setAttribute('onmouseenter', `subtaskEditButtonsOn(${i})`);
    document.getElementById(`single-subtask${i}`).setAttribute('onmouseleave', `subtaskEditButtonsOut(${i})`);
    document.getElementById(`single-subtask${i}`).classList.remove('subbtask-on-focus');
}

/**
 * Deletes a subtask from the subtask array and re-renders the subtask list.
 * 
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtask(i) {
    subtasksArray.splice(i, 1);
    renderSubtask();
}

/**
 * Closes all dropdown menus and the subtask input field.
 */
function closeFunction() {
    closeDropdownMenu('add-task-contact-div', 'assignet-arrow');
    closeDropdownMenu('add-task-category-list-div', 'category-arrow');
    closeSubtask();
}

/**
 * Clears the task by unchecking all assigned contacts, resetting priority to medium,
 * clearing subtasks, and resetting contact list and selected users.
 */
function clearTask() {
    let unchecked = `<use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>`;
    let checked = `<use href="assets/img/icons.svg#checkbox-checked-icon"></use>`;
    let contactsDiv = document.getElementById('contacts-div');
    for (let i = 0; i < contactList.length; i++) {
        let get = document.getElementById(`add-task-assignet-checkbox${i}`);
        let contact = contactList[i];
        clearTaskIF(i, get, checked, unchecked);
    }
    contactsDiv.innerHTML = '';
    changePriority('medium');
    subtasksArray = [];
    contactList = [];
    selectedUsers = [];
    initAddTask();
}

async function startCreateTask() {
    let category = 'todos';
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
        category = urlParams.get('category');
    }
    document.getElementById('overlay-div').classList.remove('d-none');
    await createTask(category);
    pauseAndExecute();
}

/**
 * Initiates the creation of a new task by setting the category based on URL parameters,
 * displaying the overlay, and asynchronously creating the task.
 */
async function createTask(category) {
    typeLabel();
    tasks = JSON.parse(await getItem('tasks'));
    let task = {
        "id": tasks.length,
        "title": document.getElementById('add-task-title').value,
        "description": document.getElementById('add-task-description').value,
        "contacts": selectedUsers,
        "dueDate": document.getElementById('add-task-date').value,
        "priority": currentPrio,
        "category": category,
        "label": currentLabel,
        "subtasks": subtasksArray,
    };
    tasks.push(task);
    await setItem('tasks', JSON.stringify(tasks));
}

/**
 * Redirects the user to the board page after clearing the task and hiding the overlay.
 */
function goToBoard() {
    document.getElementById('clear-task-button').click();
    document.getElementById('overlay-div').classList.add('d-none');
    window.location.href = 'board.html';
}

/**
 * Pauses for a short duration and then executes the function to redirect the user to the board page.
 */
function pauseAndExecute() {
    setTimeout(function () {
        goToBoard();
    }, 1500);
}