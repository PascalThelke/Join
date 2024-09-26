// If Statements

function dropdownMenuToggleIF(divID, arrow, dNone) {
  if (dNone) {
    openDropdownMenu(divID, arrow);
  } else {
    closeDropdownMenu(divID, arrow);
  }
}

function selectContactIF(i, get, unchecked, checked, user) {
  if (get.innerHTML == checked) {
    get.innerHTML = unchecked;
    document
      .getElementById(`task-contakt${i}`)
      .classList.remove("dark-background");
    selectedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser !== user
    );
  } else {
    get.innerHTML = checked;
    document
      .getElementById(`task-contakt${i}`)
      .classList.add("dark-background");
    if (!selectedUsers.includes(user)) {
      selectedUsers.push(user);
    }
  }
}

function changePriorityIF(prio, urgent, medium, low) {
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

function filterContactsForAddTaskIF(i, value, contactList, checkContact) {
  if (checkContact.includes(value)) {
    let contact = contactList[i].contact.name;
    const name = contact.split(" ");
    const firstName = name[0][0];
    const secondName = name[1] ? name[1][0] : "";
    let initials = firstName + secondName;
    document.getElementById("add-task-contact").innerHTML +=
      renderContactListForTaskHTML(i, secondName, initials, contact);
  }
}

function addSubtaskIF(subtaskInput, subtaskInputArray) {
  if (subtaskInput.value.length >= 3) {
    subtasksArray.push(subtaskInputArray);
    initAddTask();
    subtaskInput.value = "";
    closeSubtask();
  } else {
    subtaskInput.reportValidity();
  }
}

function onClickOutsideIF(element, i, e) {
  if (!element.contains(e.target)) {
    document
      .getElementById(`single-subtask${i}`)
      .setAttribute("onmouseenter", `subtaskEditButtonsOn(${i})`);
    document
      .getElementById(`single-subtask${i}`)
      .setAttribute("onmouseleave", `subtaskEditButtonsOut(${i})`);
    document
      .getElementById(`single-subtask${i}`)
      .classList.remove("subbtask-on-focus");
    document
      .getElementById(`single-subtask${i}`)
      .classList.add("subbtask-hover");
    document.getElementById(`subtask-edit-buttons${i}`).innerHTML = "";
  }
}

function clearTaskIF(i, get, checked, unchecked) {
  if (get.innerHTML == checked) {
    get.innerHTML = unchecked;
    document
      .getElementById(`task-contakt${i}`)
      .classList.remove("dark-background");
  }
}

// HTML

/**
 * Generates HTML markup for rendering a contact in the task list.
 *
 * @param {number} i - The index of the contact.
 * @param {string} secondName - The second name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} contact - The name of the contact.
 * @returns {string} HTML markup for rendering the contact.
 */
function renderContactListForTaskHTML(i, secondName, initials, contact) {
  return /*html*/ `
    <div id="task-contakt${i}" class="add-task-single" onclick="selectContact(${i})">
        <div class="name-div">
            <span class="initials letter-${secondName.toLowerCase()}">${initials}</span>
            <span>${contact}</span>
        </div>
        <div>
            <svg id="add-task-assignet-checkbox${i}" class="add-task-assignet-checkbox">
                <use href="assets/img/icons.svg#checkbox-unchecked-icon"></use>
            </svg>
        </div>
    </div>
`;
}

function renderSubtaskHTML(i, subtask) {
  return /*html*/ `
    <li id="single-subtask${i}" class="subbtask subbtask-hover" onmouseenter="subtaskEditButtonsOn(${i})" onmouseleave="subtaskEditButtonsOut(${i})" onclick="focusSubtask(${i})">
        <span id="single-subtask-txt${i}" contenteditable="true" class="subbtask-span" value="${subtask}">${subtask}</span>
        <div id="subtask-edit-buttons${i}" class="subtask-icons-single-div" onclick="doNotClose(event)"></div>
    </li>
`;
}

function closeSubtaskHTML() {
  return /*html*/ `
    <button type="button" id="add-subtask-button" formnovalidate onclick="openSubtask()">
        <svg class="subtask-icons">
            <use href="assets/img/icons.svg#plus-add-icon"></use>
        </svg>
    </button>
`;
}

function openSubtaskHTML() {
  return /*html*/ `
    <svg class="subtask-icons" onclick="closeSubtask()">
        <use href="assets/img/icons.svg#x-icon"></use>
    </svg>
    <div class="mini-seperator"></div>
    <button type="button" id="add-subtask-button" formnovalidate onclick="addSubtask()">
        <svg class="subtask-icons">
            <use href="assets/img/icons.svg#hook-icon"></use>
        </svg>
    </button>
`;
}

function editSubtaskHTML(i) {
  return /*html*/ `
    <svg class="subtask-icons-single" onclick="focusSubtask(${i})">
        <use href="assets/img/icons.svg#edit-pen"></use>
    </svg>
    <svg class="subtask-icons-single" onclick="deleteSubtask(${i})">
        <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
    </svg>
`;
}

function focusSubtaskHTML(i) {
  return /*html*/ `
    <svg class="subtask-icons-single" onclick="deleteSubtask(${i})">
        <use href="assets/img/icons.svg#trashcan-delete-icon"></use>
    </svg>
    <div class="mini-seperator"></div>
    <svg class="subtask-icons-single" onclick="editSubtask(${i})">
        <use href="assets/img/icons.svg#hook-icon"></use>
    </svg>
`;
}
