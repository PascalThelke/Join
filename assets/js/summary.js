async function initSummary() {
  await init();
  await getTodosForBoard();
  updateGreeting();
  await renderNumbersOfTasks();
}

let todo = [];

/**
 * Retrieves the todos associated with the current board from the storage.
 * @returns {Promise} - A Promise that resolves with the retrieved todos.
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
 * Retrieves the current user's information from the local storage and updates the summary user name and header initials accordingly.
 * @returns {Promise} - A Promise that resolves with the retrieved user's information.
 */
async function getCurrentUser() {
  let userName = JSON.parse(localStorage.getItem("currentUserName"));
  let userEmail = JSON.parse(localStorage.getItem("currentUserEmail"));
  let summaryUserName = document.getElementById('summary-userName');
  if (!userName) {
    userName = "Guest";
    userEmail = "guest@test.de";
  }else{
    summaryUserName.textContent = userName;
  }
  let { profileinitials } = getInitialsforHeader(userName);
  document.getElementById(
    "header_initials"
  ).innerHTML = `${profileinitials.toUpperCase()}`;
}

/**
 * Generates initials for the header based on the provided contact name.
 * @param {string} contact The contact name for which initials are generated.
 * @returns {Object} An object containing the generated profile initials.
 */
function getInitialsforHeader(contact) {
  const contactString = String(contact);
  const words = contactString.split(" ");
  const firstName = words[0][0];
  const secondName = words[1] ? words[1][0] : "";
  const profileinitials = firstName + secondName;
  return { profileinitials };
}

/**
 * Updates the greeting message based on the current time.
 */
function updateGreeting() {
  let greetingTime = document.getElementById("greet");
  let currentDate = new Date();
  let currentHour = currentDate.getHours();

  if (currentHour >= 5 && currentHour < 12) {
    greetingTime.textContent = "Good Morning,";
  } else if (currentHour >= 12 && currentHour < 18) {
    greetingTime.textContent = "Good Afternoon,";
  } else {
    greetingTime.textContent = "Good Evening,";
  }
}

/**
 * Renders the number of tasks in different categories and with different priorities.
 */
async function renderNumbersOfTasks() {
  let numberOfToDo = document.getElementById("task-counter-todo");
  let numberOfDone = document.getElementById("task-counter-done");
  let numberOfUrgent = document.getElementById("urgent-counter");
  let numberOfAll = document.getElementById("task-counter-all");
  let numberInProgress = document.getElementById("task-counter-Inprogress");
  let numberOfAwait = document.getElementById("task-counter-awaiting");
  let countToDo = 0;
  let countDone = 0;
  let countUrgent = 0;
  let countAll = todo.length;
  let countInProgress = 0;
  let countAwait = 0;
  for (let i = 0; i < todo.length; i++) {
    if (todo[i].task.category === "todos") {
      countToDo++;
    } else if (todo[i].task.category === "done") {
      countDone++;
    } else if (todo[i].task.category === "inprogress") {
      countInProgress++;
    } else if (todo[i].task.category === "await") {
      countAwait++;
    }
    if (todo[i].task.priority === "urgent") {
      countUrgent++;
    }
  }
  numberOfToDo.innerText = countToDo;
  numberOfDone.innerText = countDone;
  numberOfUrgent.innerText = countUrgent;
  numberOfAll.innerText = countAll;
  numberInProgress.innerText = countInProgress;
  numberOfAwait.innerText = countAwait;
  renderNearestDueDate();
}

/**
 * Renders the nearest due date among the tasks.
 */
function renderNearestDueDate() {
  let nearestDueDateContainer = document.getElementById("deadline-date");
  let currentDate = new Date();
  let nearestDueDate = new Date("9999-12-31");
  for (let i = 0; i < todo.length; i++) {
    if (todo[i].task.dueDate) {
      let todoDueDate = new Date(todo[i].task.dueDate);
      if (todoDueDate > currentDate && todoDueDate < nearestDueDate) {
        nearestDueDate = todoDueDate;
      }
    }
  }
  nearestDueDateContainer.innerText = nearestDueDate.toLocaleDateString();
}
