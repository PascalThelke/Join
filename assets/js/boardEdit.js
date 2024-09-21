let currentTaskId = null;

/**
 * Changes the priority of the todo being edited and updates the UI accordingly.
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 */
function changePriorityEdit(prio) {
  let urgent = document.getElementById("prio-button-urgent-edit");
  let medium = document.getElementById("prio-button-medium-edit");
  let low = document.getElementById("prio-button-low-edit");
  if (prio == "urgent") {
    if (urgent.classList.contains("urgent")) {
    } else {
      urgent.classList.add("urgent");
      currentPrio = "urgent";
      medium.classList.remove("medium");
      low.classList.remove("low");
    }
  } else if (prio == "medium") {
    if (medium.classList.contains("medium")) {
    } else {
      medium.classList.add("medium");
      currentPrio = "medium";
      urgent.classList.remove("urgent");
      low.classList.remove("low");
    }
  } else if (prio == "low") {
    if (low.classList.contains("low")) {
    } else {
      low.classList.add("low");
      currentPrio = "low";
      urgent.classList.remove("urgent");
      medium.classList.remove("medium");
    }
  }
}

/**
 * Sets the current label based on the value selected in the edit task form.
 */
function typeLabelEdit() {
  currentLabel = document.getElementById("add-task-category-edit").value;
  closeDropdownMenu("add-task-category-list-div-edit", "category-arrow");
}

/**
 * Selects the label in the edit task form based on the provided label value.
 * @param {string} label - The label value to be selected.
 */
function selectLabelEdit(label) {
  document.getElementById("add-task-category-edit").value = `${label}`;
  currentLabel = document.getElementById("add-task-category-edit").value;
  closeDropdownMenu("add-task-category-list-div-edit", "category-arrow");
}

/**
 * Renders the subtask edit section in the task edit form.
 * @param {number} j - The index of the todo item.
 */
function renderSubtaskEdit(currentTodo) {
  let subtasks = document.getElementById("subtask-container-edit");
  if (!currentTodo.task.subtasks) {
    subtasks.innerHTML = "";
    return;
  } else {
    for (let i = 0; i < currentTodo.task.subtasks.length; i++) {
      const subtask = currentTodo.task.subtasks[i].task;
      subtasks.innerHTML += /*html*/ `
            <li id="single-subtask-edit${i}" class="subbtask subbtask-hover" onmouseenter="subtaskEditButtonsOnEdit(${i})" onmouseleave="subtaskEditButtonsOutEdit(${i})" onclick="focusSubtaskEdit(${i}, ${currentTodo})">
                <span id="single-subtask-txt-edit${i}" contenteditable="true" class="subbtask-span" value="${subtask}">${subtask}</span>
                <div id="subtask-edit-buttons-edit${i}" class="subtask-icons-single-div" onclick="doNotClose(event)"></div>
            </li>
        `;
    }
  }
}

/**
 * Adds a subtask to the todo item being edited.
 * @param {number} i - The index of the todo item.
 */
async function addSubtaskEdit(i) {
  let subtaskInput = document.getElementById("add-task-subtasks-edit");
  let subtaskInputArray = {
    task: subtaskInput.value,
    done: false,
  };
  if (subtaskInput.value.length >= 3) {
    let task = todo.find(task => task.id === i);
    if (task) {
      task.task.subtasks.push(subtaskInputArray);
      console.log(task.task.subtasks);
      await setItem(`tasks/${i}`, task);  // Hier wird die `putItem`-Methode verwendet
      
      renderSubtaskEdit(task); // Render die aktualisierte Subtask-Liste
      subtaskInput.value = ""; // Setze das Input-Feld zurück
      closeSubtask(); // Schließe das Subtask-Feld
    } else {
      console.error("Task mit der ID " + i + " wurde nicht gefunden.");
    }
  } else {
    subtaskInput.reportValidity(); // Zeige eine Fehlermeldung an, wenn die Eingabe zu kurz ist
  }
}


/**
 * Opens the subtask edit dialog for the specified todo item.
 * @param {number} i - The index of the todo item.
 */
function openSubtaskEdit(i) {
  document.getElementById("subbtask-input-icon-edit").innerHTML = /*html*/ `
        <svg class="subtask-icons" onclick="closeSubtaskEdit('${i}')">
            <use href="assets/img/icons.svg#x-icon"></use>
        </svg>
        <div class="mini-seperator"></div>
        <button type="button" id="add-subtask-button-edit" class="subtask-button-edit" formnovalidate onclick="addSubtaskEdit('${i}')">
            <svg class="subtask-icons">
                <use href="assets/img/icons.svg#hook-icon"></use>
            </svg>
        </button>
    `;
  document.getElementById("add-task-subtasks-edit").focus();
}

/**
 * Closes the subtask edit dialog.
 * @param {number} i - The index of the todo item.
 */
function closeSubtaskEdit(i) {
  document.getElementById("subbtask-input-icon-edit").innerHTML = /*html*/ `
        <button type="button" id="add-subtask-button-edit" class="subtask-button-edit" formnovalidate onclick="openSubtaskEdit('${i}')">
            <svg class="subtask-icons">
                <use href="assets/img/icons.svg#plus-add-icon"></use>
            </svg>
        </button>
    `;
  document.getElementById("add-task-subtasks-edit").value = "";
}

/**
 * Handles the mouseenter event for subtask edit buttons.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function subtaskEditButtonsOnEdit(i, j) {
  document.getElementById(
    `subtask-edit-buttons-edit${i}`
  ).innerHTML = /*html*/ `
        <svg class="subtask-icons-single" onclick="focusSubtaskEdit(${i}, ${j})">
            <use href="assets/img/icons.svg#edit-pen"></use>
        </svg>
        <div class="mini-seperator"></div>
        <svg class="subtask-icons-single" onclick="deleteSubtaskEdit(${i}, ${j})">
            <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
        </svg>
    `;
}

/**
 * Handles the mouseleave event for subtask edit buttons.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function subtaskEditButtonsOutEdit(i, j) {
  document.getElementById(`subtask-edit-buttons-edit${i}`).innerHTML = "";
}

/**
 * Focuses on editing a subtask and displays edit/delete buttons.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function focusSubtaskEdit(i, j) {
  document
    .getElementById(`single-subtask-edit${i}`)
    .removeAttribute("onmouseenter");
  document
    .getElementById(`single-subtask-edit${i}`)
    .removeAttribute("onmouseleave");
  document
    .getElementById("body")
    .setAttribute(
      "onclick",
      `closeFunctionEdit(); startOnClickOutsideEdit(${i}, ${j})`
    );
  document.getElementById(
    `subtask-edit-buttons-edit${i}`
  ).innerHTML = /*html*/ `
        <svg class="subtask-icons-single" onclick="deleteSubtaskEdit(${i}, ${j})">
            <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
        </svg>
        <div class="mini-seperator"></div>
        <svg class="subtask-icons-single" onclick="editSubtaskEdit(${i}, ${j})">
            <use href="assets/img/icons.svg#hook-icon"></use>
        </svg>
    `;
  document.getElementById(`single-subtask-txt-edit${i}`).focus();
  document
    .getElementById(`single-subtask-edit${i}`)
    .classList.add("subbtask-on-focus");
  document
    .getElementById(`single-subtask-edit${i}`)
    .classList.remove("subbtask-hover");
}

/**
 * Listens for clicks outside the specified element and triggers actions accordingly.
 * @param {HTMLElement} element - The HTML element.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function onClickOutsideEdit(element, i, j) {
  document.addEventListener("click", (e) => {
    if (!element.contains(e.target)) {
      document
        .getElementById(`single-subtask-edit${i}`)
        .setAttribute("onmouseenter", `subtaskEditButtonsOnEdit(${i}, ${j})`);
      document
        .getElementById(`single-subtask-edit${i}`)
        .setAttribute("onmouseleave", `subtaskEditButtonsOutEdit(${i}, ${j})`);
      document
        .getElementById(`single-subtask-edit${i}`)
        .classList.remove("subbtask-on-focus");
      document
        .getElementById(`single-subtask-edit${i}`)
        .classList.add("subbtask-hover");
      document.getElementById(`subtask-edit-buttons-edit${i}`).innerHTML = "";
    }
  });
}

/**
 * Starts listening for clicks outside the specified element and triggers actions accordingly.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function startOnClickOutsideEdit(i, j) {
  const myElement = document.getElementById(`single-subtask-edit${i}, ${j}`);
  onClickOutsideEdit(myElement, i, j);
}

/**
 * Edits the content of a subtask in the edit mode.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function editSubtaskEdit(i, j) {
  const subtask = todo[j].subtasks[i];
  subtask.splice(
    i,
    1,
    document.getElementById(`single-subtask-txt-edit${i}`).innerHTML
  );
  document.getElementById(
    `subtask-edit-buttons-edit${i}`
  ).innerHTML = /*html*/ `
        <svg class="subtask-icons-single" onclick="focusSubtaskEdit(${i})">
            <use href="assets/img/icons.svg#edit-pen"></use>
        </svg>
        <svg class="subtask-icons-single" onclick="deleteSubtaskEdit(${i}, ${j})">
            <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
        </svg>
`;
  document
    .getElementById(`single-subtask-edit${i}`)
    .setAttribute("onmouseenter", `subtaskEditButtonsOnEdit(${i})`);
  document
    .getElementById(`single-subtask-edit${i}`)
    .setAttribute("onmouseleave", `subtaskEditButtonsOutEdit(${i})`);
  document
    .getElementById(`single-subtask-edit${i}`)
    .classList.remove("subbtask-on-focus");
}

/**
 * Deletes a subtask from the todo item in the edit mode.
 * @param {number} i - The index of the subtask.
 * @param {number} j - The index of the todo item.
 */
function deleteSubtaskEdit(i, j) {
  todo[j].subtasks.splice(i, 1);
  upload();
  renderSubtaskEdit(j);
}

/**
 * Clears the task edit form by resetting checkboxes, contact list, priority, and subtasks array.
 */
function clearTaskEdit() {
  let unchecked = `<use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>`;
  let checked = `<use href="assets/img/icons.svg#checkbox-checked-icon"></use>`;
  let contactsDiv = document.getElementById("contacts-div");
  for (let i = 0; i < contactList.length; i++) {
    let get = document.getElementById(`add-task-assignet-checkbox-edit${i}`);
    let contact = contactList[i];
    if (get.innerHTML == checked) {
      get.innerHTML = unchecked;
      document
        .getElementById(`task-contakt${i}`)
        .classList.remove("dark-background");
    }
  }
  contactsDiv.innerHTML = "";
  changePriority("medium");
  subtasksArray = [];
  contactList = [];
  selectedUsers = [];
  initAddTask();
}

/**
 * Loads the contact list from local storage and renders it for tasks.
 *
 * @returns {Promise<void>} A Promise that resolves after loading and rendering the contact list.
 */
async function loadContactListEdit(currentTodo) {
  try {
    const contactListResponse = await getItem("contacts");
    contactList = [];

    if (contactListResponse) {
      Object.keys(contactListResponse).forEach((key) => {
        contactList.push({
          id: key,
          contact: contactListResponse[key],
        });
      });
    }
    renderContactListForTask(currentTodo);
    renderContactListForTaskEdit(currentTodo);
    updateSelectedUsersEdit();
  } catch (e) {
    console.error("Loading error:", e);
  }

}

/**
 * Renders the contact list for tasks.
 */
function renderContactListForTaskEdit(currentTodo) {
  selectedUsers = currentTodo.task.contacts;
  document.getElementById("add-task-contact-edit").innerHTML = "";
  if(currentTodo.task.contacts){
    for (let i = 0; i < selectedUsers.length; i++) {
        let contact = selectedUsers[i];
        const name = contact.split(" ");
        const firstName = name[0][0];
        const secondName = name[1] ? name[1][0] : "";
        let initials = firstName + secondName;
        let isChecked = selectedUsers.includes(contact);
        let checkboxSVGId = `add-task-assignet-checkbox-edit${currentTodo.id}`;
        let checkboxSVG = isChecked
          ? `<svg id="${checkboxSVGId}" class="add-task-assignet-checkbox">
                      <use href="assets/img/icons.svg#checkbox-checked-icon"></use>
                  </svg>`
          : `<svg id="${checkboxSVGId}" class="add-task-assignet-checkbox">
                      <use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>
                  </svg>`;
    
        let backgroundClass = isChecked ? "dark-background" : "";
    
        document.getElementById("add-task-contact-edit").innerHTML +=
          renderContactListForTaskEditHTML(
            contact,
            i,
            secondName,
            initials,
            currentTodo.id
          );
      }
  }
  
}

/**
 * Filters and renders contacts for adding tasks based on the input value.
 */
async function filterContactsForAddTaskEdit() {
  document.getElementById("add-task-contact-edit").innerHTML = "";
  let value = document
    .getElementById("add-task-assignet-to-edit")
    .value.toLowerCase();
  let taskToEdit = todo.filter((t) => t.id == "todos");
  for (let i = 0; i < currentTodo.task.contacts.length; i++) {
    let contact = currentTodo.task.contacts[i];
    const name = contact.split(" ");
    const firstName = name[0][0];
    const secondName = name[1] ? name[1][0] : "";
    let initials = firstName + secondName;

    document.getElementById("add-task-contact-edit").innerHTML +=
      renderContactListForTaskEditHTML(
        contact,
        i,
        secondName,
        initials,
        currentTodo.id
      );
  }
}

/**
 * Generates HTML markup for rendering a contact in the task list.
 *
 * @param {string} contact - The name of the contact.
 * @param {number} i - The index of the contact.
 * @param {string} secondName - The second name of the contact.
 * @param {string} initials - The initials of the contact.
 * @returns {string} HTML markup for rendering the contact.
 */
function renderContactListForTaskEditHTML(
  contact,
  i,
  secondName,
  initials,
  taskId
) {
  console.log(taskId);
  return /*html*/ `
        <div id="task-contakt-edit${taskId}" class="add-task-single" onclick="selectContactEdit('${taskId}')">
            <div class="name-div">
                <span class="initials letter-${secondName.toLowerCase()}">${initials}</span>
                <span>${contact}</span>
            </div>
            <div>
                <svg id="add-task-assignet-checkbox-edit${taskId}" class="add-task-assignet-checkbox">
                    <use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>
                </svg>
            </div>
        </div>
    `;
}

/**
 * Selects or deselects a contact based on its index and updates the list of selected users.
 *
 * @param {number} i - The index of the contact.
 */
function selectContactEdit(i) {
  let currentTodo = todo.find((t) => t.id === i);
  currentTaskId = currentTodo.id;
  console.log(`Current Todo ID: ${currentTodo.id}`);

  let get = document.getElementById(
    `add-task-assignet-checkbox-edit${currentTodo.id}`
  );
  if (!get) {
    console.error(
      `Element with ID add-task-assignet-checkbox-edit${currentTodo.id} not found`
    );
    return;
  }

  let isChecked =
    get.querySelector("use").getAttribute("href") ===
    "assets/img/icons.svg#checkbox-checked-icon";
  currentTodo.task.contacts.forEach((contact) => {
    let user = contact;
    if (isChecked) {
      get.innerHTML =
        '<use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>';
      let taskContactEditElement = document.getElementById(
        `task-contakt-edit${currentTodo.id}`
      );
      if (taskContactEditElement) {
        taskContactEditElement.classList.remove("dark-background");
      } else {
        console.error(
          `Element with ID task-contakt-edit${currentTodo.id} not found`
        );
      }
      selectedUsers = selectedUsers.filter(
        (selectedUser) => selectedUser !== user
      );
    } else {
      get.innerHTML =
        '<use href="assets/img/icons.svg#checkbox-checked-icon"></use>';
      let taskContactEditElement = document.getElementById(
        `task-contakt-edit${i}`
      );
      if (taskContactEditElement) {
        taskContactEditElement.classList.add("dark-background");
      } else {
        console.error(`Element with ID task-contakt-edit${i} not found`);
      }
      if (!selectedUsers.includes(user)) {
        selectedUsers.push(user);
      }
    }
  });

  updateSelectedUsersEdit(i);
}

/**
 * Updates the list of selected users and renders their initials.
 *
 * @param {number} i - The index of the contact.
 */
function updateSelectedUsersEdit(i) {
  let contactsDiv = document.getElementById("contacts-div-edit");
  contactsDiv.innerHTML = "";
  if(selectedUsers){
    selectedUsers.forEach((selectedUser, i) => {
      let nameParts = selectedUser.split(" ");
      let initials = nameParts.map((part) => part[0]).join("");
      let secondName = nameParts[1] ? nameParts[1][0].toLowerCase() : "";
  
      contactsDiv.innerHTML += /*html*/ `
              <div class="name-div selected-initials">
                  <span class="initials letter-${secondName}">${initials}</span>
              </div>
          `;
    });
  }
}

/**
 * Edits a todo item.
 * @param {Event} event - The event object.
 * @param {number} i - The index of the todo item to be edited.
 */
function editTodo(event, i) {
  let currentTodo = todo.find((t) => t.id === i);
  event.stopPropagation();
  loadContactListEdit(currentTodo);
  document
    .getElementById("add-task-form-edit")
    .setAttribute("onsubmit", `createTaskEdit('${i}'); return false`);
  selectedUsers.push(currentTodo);
  document.getElementById("add-task-container-edit").classList.remove("d-none");
  document.getElementById(
    "add-task-title-edit"
  ).value = `${currentTodo.task.title}`;
  document.getElementById(
    "add-task-description-edit"
  ).value = `${currentTodo.task.description}`;
  document.getElementById(
    "add-task-date-edit"
  ).value = `${currentTodo.task.dueDate}`;
  changePriorityEdit(currentTodo.task.priority);
  selectLabelEdit(currentTodo.task.label);
  renderSubtaskEdit(currentTodo);
  document
    .getElementById("add-task-subtasks-edit")
    .setAttribute("onclick", `openSubtaskEdit('${i}')`);
  document
    .getElementById("add-subtask-button-edit")
    .setAttribute("onclick", `openSubtaskEdit('${i}')`);
}

/**
 * Closes the edit todo overlay.
 */
function closeEditTodo() {
  document.getElementById("add-task-container-edit").classList.add("d-none");
}

/**
 * Initiates the creation of a new task by setting the category based on URL parameters,
 * displaying the overlay, and asynchronously creating the task.
 */
async function createTaskEdit(currentTodo) {
  let toSaveTask = todo.find((t) => t.id === currentTodo);
  typeLabelEdit();
  toSaveTask.task.title = document.getElementById("add-task-title-edit").value;
  toSaveTask.task.description = document.getElementById(
    "add-task-description-edit"
  ).value;
  toSaveTask.task.contacts = selectedUsers;
  toSaveTask.task.dueDate = document.getElementById("add-task-date-edit").value;
  toSaveTask.task.priority = currentPrio;
  toSaveTask.task.label = currentLabel;
  await setItem(`tasks/${currentTodo}`, toSaveTask.task);
  closeEditTodo();
  closeAddTaskOverlay();
  closeDialog();
  boardInit();
}
