let todoId;
let clean;
let todo = [];
let currentDraggedElement;
let subtaskCount;

/**
 * Initializes the board by performing necessary setup tasks.
 *
 * @returns {Promise<void>} A Promise that resolves when the board is initialized.
 */
async function boardInit() {
  await init();
  await getTodosForBoard();
  updateBoard();
  noTaskInContainer();
  initAddTask();
}

/**
 * Retrieves the list of todos from storage for the board.
 *
 * @returns {Promise<void>} A Promise that resolves when the todos are retrieved and logged.
 */
async function getTodosForBoard() {
  try {
    const tasksResponse = await getItem("tasks");
    console.log("response", tasksResponse);
    todo = [];

    if (tasksResponse) {
      Object.keys(tasksResponse).forEach((task) => {
        todo.push({
          id: task,
          task: tasksResponse[task],
        });
      });
    }

    console.log("as array", todo);
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Updates the board with the current list of todos.
 */
function updateBoard() {
  let todos = todo.filter((t) => t.task["category"] == "todos"); // Zugriff auf t.task['category']
  document.getElementById("task_content_open").innerHTML = "";
  for (let index = 0; index < todos.length; index++) {
    let clean = todos[index].task; // Zugriff auf das task-Objekt
    let taskId = todos[index].id;
    let { progressWidth, subTasksDone, subTasksTotal } =
      getSubtaskDoneCounter(clean);
    document.getElementById("task_content_open").innerHTML += generateTodo(
      clean,
      progressWidth,
      subTasksDone,
      subTasksTotal,
      taskId
    );
  }

  let inprogress = todo.filter((t) => t.task["category"] == "inprogress"); // Zugriff auf t.task['category']
  document.getElementById("close_one").innerHTML = "";
  for (let index = 0; index < inprogress.length; index++) {
    let clean = inprogress[index].task; // Zugriff auf das task-Objekt
    let taskId = inprogress[index].id;
    let { progressWidth, subTasksDone, subTasksTotal } =
      getSubtaskDoneCounter(clean);
    document.getElementById("close_one").innerHTML += generateTodo(
      clean,
      progressWidth,
      subTasksDone,
      subTasksTotal,
      taskId
    );
  }

  let awaitList = todo.filter((t) => t.task["category"] == "await"); // Zugriff auf t.task['category']
  document.getElementById("await_content").innerHTML = "";
  for (let index = 0; index < awaitList.length; index++) {
    let clean = awaitList[index].task; // Zugriff auf das task-Objekt
    let taskId = awaitList[index].id;
    let { progressWidth, subTasksDone, subTasksTotal } =
      getSubtaskDoneCounter(clean);
    document.getElementById("await_content").innerHTML += generateTodo(
      clean,
      progressWidth,
      subTasksDone,
      subTasksTotal,
      taskId
    );
  }

  let doneList = todo.filter((t) => t.task["category"] == "done"); // Zugriff auf t.task['category']
  document.getElementById("done_content").innerHTML = "";
  for (let index = 0; index < doneList.length; index++) {
    let clean = doneList[index].task; // Zugriff auf das task-Objekt
    let taskId = doneList[index].id;
    let { progressWidth, subTasksDone, subTasksTotal } =
      getSubtaskDoneCounter(clean);
    document.getElementById("done_content").innerHTML += generateTodo(
      clean,
      progressWidth,
      subTasksDone,
      subTasksTotal,
      taskId
    );
  }
}

/**
 * Sets the current dragged element when starting the drag operation.
 * @param {string} todoId - The ID of the todo being dragged.
 */
function startDragging(todoId) {
  currentDraggedElement = todoId;
}

/**
 * Calculates the number of subtasks done and the progress width for a given task.
 * @param {object} clean - The task object containing subtasks.
 * @returns {object} An object containing the progress width, number of subtasks done, and total number of subtasks.
 */
function getSubtaskDoneCounter(clean) {
  if (!clean.subtasks) {
    return { progressWidth: 0, subTasksDone: 0, subTasksTotal: 0 };
  } else {
    let subTasksTotal = clean.subtasks.length;
    let subTasksDone = 0;
    clean.subtasks.forEach((subtask) => {
      if (subtask.done === true) {
        subTasksDone++;
      }
    });
    let progressWidth = (subTasksDone / subTasksTotal) * 100;
    return { progressWidth, subTasksDone, subTasksTotal }; // progressWidth zurückgeben
  }
}

/**
 * Generates HTML markup for displaying a todo item.
 * @param {object} clean - The task object containing task details.
 * @param {number} progressWidth - The width of the progress bar.
 * @param {number} subTasksDone - The number of subtasks done.
 * @param {number} subTasksTotal - The total number of subtasks.
 * @returns {string} HTML markup representing the todo item.
 */
/**
 * Generates HTML markup for displaying a todo item.
 * @param {object} clean - The task object containing task details.
 * @param {number} progressWidth - The width of the progress bar.
 * @param {number} subTasksDone - The number of subtasks done.
 * @param {number} subTasksTotal - The total number of subtasks.
 * @returns {string} HTML markup representing the todo item.
 */
function generateTodo(
  clean,
  progressWidth,
  subTasksDone,
  subTasksTotal,
  taskId
) {
  const todoId = `${taskId}`;
  let descriptionWords = clean["description"].split(" ");
  let truncatedDescription = descriptionWords.slice(0, 5).join(" ");
  if (descriptionWords.length > 5) {
    truncatedDescription += "...";
  }
  let memberHtml = "";
  if (clean.contacts) {
    for (let i = 0; i < clean.contacts.length; i++) {
      const member = clean.contacts[i];
      const { profileinitials, secondName } = getInitials(member);
      memberHtml += `
            <div class="circle letter-${secondName.toLowerCase()}">${profileinitials}</div>
        `;
    }
  }
  return `<div draggable="true" class="todo" ondragstart="startDragging('${todoId}')" ondragover="highlight('${todoId}')" id="${todoId}" onclick="openDialog('${todoId}')">
    <div class="arrow_flex">
        <div class="card_label">${clean["label"]}</div>
    </div>
    <div class="card_title">${clean["title"]}</div>
    <div class="card_description">${truncatedDescription}</div>
    <div id="myProgress${todoId}" style="${
    subTasksTotal === 0 ? "display: none;" : ""
  }">
        <div class="myBarContainer">
            <div id="myBar" style="width: ${progressWidth}%;"></div>
        </div>
        <div><span>Subtask ${subTasksDone}/${subTasksTotal}</span></div>
    </div>
    <div class ="space-between w100p">
        <div class="member_flex" id="members_${todoId}">
            ${memberHtml}
        </div>
        <div class="prio_icon_containers">
            <svg width="22" height="20">
                <use href="assets/img/icons.svg#${
                  clean.priority
                }-prio-icon-for-board"></use>
            </svg>
        </div>
    </div>
</div>`;
}

/**
 * Uploads the current state of tasks to the storage.
 * @returns {Promise<void>}
 */
// async function upload() {
//   await postItem("tasks", todo);
// }

/**
 * Prevents the default behavior for a drop event.
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves a todo item to the specified category and updates the board.
 * @param {string} category - The category to which the todo item will be moved.
 */
function moveTo(category) {
  let selectedTodo = todo.find((t) => t.id == currentDraggedElement);
  selectedTodo.task["category"] = category;
  setItem(`tasks/${currentDraggedElement}`, selectedTodo.task);
  updateBoard();
  noTaskInContainer();
}
function noTaskInContainer() {
  let noTodos = document.getElementById("task_content_open").innerHTML;
  if (noTodos === "") {
    document.getElementById("noTodo").classList.remove("d_nones");
  } else {
    document.getElementById("noTodo").classList.add("d_nones");
  }
  let noInProgress = document.getElementById("close_one").innerHTML;
  if (noInProgress === "") {
    document.getElementById("noInprogresss").classList.remove("d_nones");
  } else {
    document.getElementById("noInprogresss").classList.add("d_nones");
  }

  let noAwaitFeedback = document.getElementById("await_content").innerHTML;
  if (noAwaitFeedback === "") {
    document.getElementById("noFeedback").classList.remove("d_nones");
  } else {
    document.getElementById("noFeedback").classList.add("d_nones");
  }

  let noDone = document.getElementById("done_content").innerHTML;
  if (noDone === "") {
    document.getElementById("noDoneContent").classList.remove("d_nones");
  } else {
    document.getElementById("noDoneContent").classList.add("d_nones");
  }
}

/**
 * Adds a CSS class to highlight a todo item when it is being dragged over.
 * @param {string} todoId - The ID of the todo item.
 */
function highlight(todoId) {
  document.getElementById(todoId).classList.add("drag-area-highlight");
}

/**
 * Removes a CSS class to remove the highlight from a todo item after dragging.
 * @param {string} todoId - The ID of the todo item.
 */
function removeHighlight(todoId) {
  document.getElementById(todoId).classList.remove("drag-area-highlight");
}

/**
 * Renders a dialog box with details of the selected todo item.
 * @param {object} selectedTodo - The selected todo item object.
 * @param {number} selectedTodoID - The ID of the selected todo item.
 */
async function renderDialog(selectedTodo, selectedTodoID) {
  document.getElementById("user_story_dialog").innerHTML = await returnDialog(
    selectedTodo.task,
    selectedTodoID
  );
  await prioImg(selectedTodo.task["priority"], selectedTodoID);
  await renderMemberList(selectedTodo.task);
  if (selectedTodo.task.subtasks) {
    renderSubtaskDialog(selectedTodo);
  } else {
    document.getElementById("subtaskContainerWrapper").style.display = "none";
  }
}

/**
 * Returns the HTML markup for the dialog displaying details of the selected todo.
 * @param {Object} selectedTodo - The selected todo object containing details.
 * @param {number} selectedTodoID - The ID of the selected todo.
 * @returns {string} The HTML markup for the dialog.
 */
async function returnDialog(selectedTodo, selectedTodoID) {
  return `
    <div class="user_story_label_x_contrainer">
        <div class="user_story">${selectedTodo["label"]}<div></div>
        </div>
        <button onclick="closeDialog()">X</button>
    </div>
    <div id="dialog_title" class="user_story_headline">
        <div> ${selectedTodo["title"]} </div>
    </div>
    <div class="user_story_description">${selectedTodo["description"]}</div>
    <div class="user_story_date">
        <div class="story_date">Due date:</div>
        <div class="user_date">${selectedTodo["dueDate"]}</div>
    </div>
    <div class="user_story_priority">
        <div class="story_priority">Priority:</div>
        <div class="user_priority">${selectedTodo["priority"]} <img id="Image" src=""> </div>
    </div>
    <div class="assigned_to_members_container">
        <div class="assigned_to">Assigned To:</div>
        <div class="assinged_member">
            <div class="member_flex">
                <div id="board_member_content" class="circle_flex">

                </div>
            </div>
        </div>
        <div id="subtaskContainerWrapper" class="user_story_Subtasks">
            <div>Subtasks</div>
            <div class="subtask_center" id="subtaskContainer"><img src="./assets/img/accept.png" alt=""> <span>Implement
                    Recipe
                    Recommendation</span></div>
        </div>
        <div class="user_story_delete_edit">
            <div class="user_story_delete_edit_one"><button class="edit-button"><img src="./assets/img/delete.png" alt="">
                    <div onclick="deleteTodo(event, '${selectedTodoID}')">Delete</div>
                </button></div>
            <div class="stripe"></div>
            <div class="user_story_delete_edit_two"><button class="edit-button" onclick="editTodo(event, '${selectedTodoID}')"><img
                        src="./assets/img/edit.png" alt="">
                    <div>Edit</div>
                </button></div>
        </div>
        `;
}

/**
 * Returns the HTML content for a dialog box displaying details of the selected todo item.
 * @param {object} selectedTodo - The selected todo item object.
 * @param {number} selectedTodoID - The ID of the selected todo item.
 * @returns {string} The HTML content for the dialog box.
 */
async function renderMemberList(selectedTodo) {
  document.getElementById("board_member_content").innerHTML = "";
  if (selectedTodo.contacts) {
    for (let i = 0; i < selectedTodo.contacts.length; i++) {
      const member = selectedTodo.contacts[i];
      const { profileinitials, secondName } = getInitials(member);
      document.getElementById("board_member_content").innerHTML += `
           <div class="task_name_container"> <div class="circle letter-${secondName.toLowerCase()}">${profileinitials}</div>
            <div>${member}</div></div>
            `;
    }
  }
}

/**
 * Extracts the initials from a contact's name.
 * @param {string} contact - The contact's name.
 * @returns {Object} An object containing the profile initials and the second name's initial.
 */
function getInitials(contact) {
  const words = contact.split(" ");
  const firstName = words[0][0];
  const secondName = words[1] ? words[1][0] : "";
  const profileinitials = firstName + secondName;
  return { profileinitials, secondName };
}

/**
 * Opens a dialog box for the selected todo item.
 * @param {string} todoId - The ID of the todo item.
 */
function openDialog(todoId) {
  // let id = todoId.split('_')[1];
  let selectedTodo = todo.find((t) => t.id == todoId);
  let selectedTodoID = selectedTodo.id;
  document.getElementById("dialog_bg").classList.remove("d-none");
  renderDialog(selectedTodo, selectedTodoID);
}

/**
 * Closes the dialog box.
 */
function closeDialog() {
  document.getElementById("dialog_bg").classList.add("d-none");
}

/**
 * Filters todos by their title.
 * Updates the board with filtered todos based on the input value.
 */
function filterTodosByTitle() {
  let searchText = document.getElementById("filter_input")
    ? document.getElementById("filter_input").value.trim().toLowerCase()
    : "";
  if (searchText === "") {
    searchText = document.getElementById("filter_input_mobile")
      ? document
          .getElementById("filter_input_mobile")
          .value.trim()
          .toLowerCase()
      : "";
  }
  if (searchText === "") {
    boardInit();
    return;
  }
  let filteredTodos = todo.filter((t) =>
    t.task["title"].toLowerCase().startsWith(searchText)
  );
  document.getElementById("task_content_open").innerHTML = "";
  document.getElementById("close_one").innerHTML = "";
  document.getElementById("await_content").innerHTML = "";
  document.getElementById("done_content").innerHTML = "";
  for (let index = 0; index < filteredTodos.length; index++) {
    let clean = filteredTodos[index].task;
    if (clean.category === "todos") {
      let { progressWidth, subTasksDone, subTasksTotal } =
        getSubtaskDoneCounter(clean);
      document.getElementById("task_content_open").innerHTML += generateTodo(
        clean,
        progressWidth,
        subTasksDone,
        subTasksTotal
      );
    } else if (clean.category === "inprogress") {
      let { progressWidth, subTasksDone, subTasksTotal } =
        getSubtaskDoneCounter(clean);
      document.getElementById("close_one").innerHTML += generateTodo(
        clean,
        progressWidth,
        subTasksDone,
        subTasksTotal
      );
    } else if (clean.category === "await") {
      let { progressWidth, subTasksDone, subTasksTotal } =
        getSubtaskDoneCounter(clean);
      document.getElementById("await_content").innerHTML += generateTodo(
        clean,
        progressWidth,
        subTasksDone,
        subTasksTotal
      );
    } else if (clean.category === "done") {
      let { progressWidth, subTasksDone, subTasksTotal } =
        getSubtaskDoneCounter(clean);
      document.getElementById("done_content").innerHTML += generateTodo(
        clean,
        progressWidth,
        subTasksDone,
        subTasksTotal
      );
    }
  }
}

/**
 * Moves a todo element in the specified direction within its parent category.
 * @param {string} todoId - The ID of the todo element to be moved.
 * @param {string} direction - The direction in which to move the todo element ('up' or 'down').
 * @param {Event} event - The event object.
 */
function moveTodo(todoId, direction, event) {
  event.stopPropagation();
  const todoElement = document.getElementById(todoId);
  const parentElement = todoElement.parentNode;
  const category = parentElement.id;
  let nextCategory;
  if (direction === "up") {
    switch (category) {
      case "task_content_open":
        nextCategory = "close_one";
        break;
      case "close_one":
        nextCategory = "await_content";
        break;
      case "await_content":
        nextCategory = "done_content";
        break;
      default:
        nextCategory = null;
    }
  } else if (direction === "down") {
    switch (category) {
      case "close_one":
        nextCategory = "task_content_open";
        break;
      case "await_content":
        nextCategory = "close_one";
        break;
      case "done_content":
        nextCategory = "await_content";
        break;
      default:
        nextCategory = null;
    }
  }
  if (nextCategory) {
    todo["category"] = nextCategory;
    parentElement.removeChild(todoElement);
    document.getElementById(nextCategory).appendChild(todoElement);
  }
}
