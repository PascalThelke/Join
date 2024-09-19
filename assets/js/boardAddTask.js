/**
 * Opens the overlay for adding a new task.
 * If the window width is greater than 1000 pixels, it displays the form in the overlay;
 * otherwise, it redirects to the add_task.html page with the specified category.
 * @param {string} category - The category of the task to be added.
 */
function openAddTaskOverlay(category) {
  if (window.innerWidth > 1000) {
    document
      .getElementById("add-task-form")
      .setAttribute(
        "onsubmit",
        `startCreateTaskFromBoard("${category}"); return false`
      );
    document.getElementById("add-task-container").classList.remove("d-none");
  } else {
    var url = "add_task.html?category=" + category;
    window.location.href = url;
  }
}

/**
 * Starts the process of creating a new task from the board overlay.
 * Hides the add task container, creates a new task in the specified category,
 * clears the task input fields, updates the board, and removes the 'onsubmit' attribute from the form.
 * @param {string} category - The category of the task to be created.
 */
async function startCreateTaskFromBoard(category) {
  document.getElementById("add-task-container").classList.add("d-none");
  await createTask(category);
  clearTask();
  boardInit();
  document.getElementById("add-task-form").removeAttribute("onsubmit");
}

/**
 * Closes the add task overlay by adding the 'd-none' class to the add task container
 * and removing the 'onsubmit' attribute from the add task form.
 */
function closeAddTaskOverlay() {
  document.getElementById("add-task-container").classList.add("d-none");
  document.getElementById("add-task-form").removeAttribute("onsubmit");
}

/**
 * Deletes a todo item from the list.
 * @param {Event} event - The event object.
 * @param {number} ID - The ID of the todo item to be deleted.
 */
function deleteTodo(event, ID) {
  event.stopPropagation();
  todo.splice(ID, 1);
  upload();
  closeDialog();
  updateBoard();
}

/**
 * Sets the priority image based on the priority value of the selected todo.
 * @param {string} priority - The priority value of the selected todo.
 * @param {number} selectedTodoID - The ID of the selected todo.
 */
async function prioImg(priority, selectedTodoID) {
  document.getElementById(`Image`).innerHTML = "";
  if (priority === "urgent") {
    document.getElementById(`Image`).src = "../assets/img/icons/Heightprio.png";
  } else if (priority === "medium") {
    document.getElementById(`Image`).src = "../assets/img/icons/Mediumprio.png";
  } else if (priority === "low") {
    document.getElementById(`Image`).src = "../assets/img/icons/Lowprio.png";
  }
}

/**
 * Renders the subtask dialog for the selected todo.
 * @param {object} selectedTodo - The selected todo object.
 */
async function renderSubtaskDialog(selectedTodo) {
  document.getElementById("subtaskContainer").innerHTML = "";
  for (let i = 0; i < selectedTodo.task.subtasks.length; i++) {
    const subtask = selectedTodo.task.subtasks[i].task;
    if (selectedTodo.task.subtasks[i].done == false) {
      document.getElementById(
        "subtaskContainer"
      ).innerHTML += `  <div class="subbtask_subspan"><img id="checkBoxDialogImg${i}" onclick="checkBoxSwitchImg(${i}, '${selectedTodo.id}')" src="./assets/img/checkbox.png" alt=""> ${subtask} </div>`;
    } else {
      document.getElementById(
        "subtaskContainer"
      ).innerHTML += `  <div class="subbtask_subspan"><img id="checkBoxDialogImg${i}" onclick="checkBoxSwitchImg(${i}, '${selectedTodo.id}')" src="./assets/img/checkedButtondialog.png" alt=""> ${subtask} </div>`;
    }
  }
}

/**
 * Switches the checkbox image and updates the todo's subtask status.
 * @param {number} i - The index of the subtask.
 * @param {number} ID - The ID of the todo.
 */
async function checkBoxSwitchImg(i, ID) {
  let checkbox = document.getElementById(`checkBoxDialogImg${i}`);
  let unchecked = `./assets/img/checkbox.png`;
  let checked = `./assets/img/checkedButtondialog.png`;

  // Finde das entsprechende todo-Objekt anhand der ID
  let taskToUpdate = todo.find((t) => t.id === ID);

  // Überprüfe, ob das todo-Objekt gefunden wurde
  if (taskToUpdate) {
    // Greife auf die Subtask zu, die über den Index i bestimmt wird
    if (taskToUpdate.task.subtasks[i].done == false) {
      checkbox.src = checked;
      taskToUpdate.task.subtasks[i].done = true;
    } else {
      checkbox.src = unchecked;
      taskToUpdate.task.subtasks[i].done = false;
    }

    // Speichere die aktualisierten Daten
    await setItem(`tasks/${ID}`, taskToUpdate.task);
    updateBoard();
  } else {
    console.error(`Task with ID ${ID} not found`);
  }
}

function closeFunctionEdit() {
  closeDropdownMenu("add-task-contact-div-edit", "assignet-arrow");
  closeDropdownMenu("add-task-category-list-div-edit", "category-arrow");
  closeSubtask();
}
