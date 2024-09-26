let users = [];
let newID = 0;

/**
 * Initialisiert das Sign-Up-Modul, indem die Benutzerdaten aus dem lokalen Speicher geladen werden.
 */
async function initSignUp() {
  try {
    const usersResponse = await getItem("users");
    users = [];
    if (usersResponse) {
      Object.keys(usersResponse).forEach((user) => {
        users.push({
          id: user,
          user: usersResponse[user],
        });
      });
    }
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Adds a new user to the list of users.
 *
 * @returns {void}
 */
async function addUser() {
  let nameInput = document.getElementById("names").value;
  let emailInput = document.getElementById("emails").value;
  let passwordInput = document.getElementById("passwordField").value;

  let user = users.find(function (u) {
    return u.user.email === emailInput;
  });
  if (user) {
    userExist();
  } else {
    let newUser = {
      name: nameInput,
      email: emailInput,
      password: passwordInput,
    };
    await postItem("users", newUser);
    newID += newID;
    displaySignUpSuccessMessage();
    window.location.href = "/join/index";
  }
}

/**
 * Checks the validity of the name input field and displays an error message if invalid.
 *
 * @returns {void}
 */
function checkName() {
  let input = document.getElementById("names");
  let invalidDiv = document.getElementById("nameInvalid");
  let isValid = input.value.trim() !== "" && input.validity.valid;

  invalidDiv.textContent = isValid ? "" : "Please enter a valid name!";
  invalidDiv.classList.toggle("hidden", isValid);
  input.classList.toggle("alert", !isValid);
}

/**
 * Toggles the visibility icon for a password input field based on user interaction.
 */
function togglePasswordIcon() {
  let icon = document.getElementById("pWIcon");
  let passwordInput = document.getElementById("passwordField");

  passwordInput.addEventListener("blur", function () {
    if (passwordInput.value.trim() === "") {
      icon.src = "./assets/img/password_input.svg";
    }
  });
  passwordInput.addEventListener("input", function () {
    if (passwordInput.value.trim() === "") {
      passwordInput.type = "password";
      icon.src = "./assets/img/password_input.svg";
    } else {
      if (passwordInput.type === "text") {
        //  &&
        //  !icon.src.includes("visibility.svg")
        icon.src = "./assets/img/visibility.png";
      } else if (passwordInput.type === "password") {
        //  &&
        // !icon.src.includes("visibility_off.png")
        icon.src = "./assets/img/visibility_off.png";
      }
    }
  });
}

/**
 * Checks the validity of the password and confirmation password inputs.
 * If both inputs are non-empty, it checks if they match and calls hidePasswordMismatchMessage if they do, otherwise calls handlePwMismatch.
 * If either input is empty, it removes the "alert" class from both inputs.
 */
function checkPasswordValidity() {
  let passwordInput = document.getElementById("passwordField");
  let passwordConfirm = document.getElementById("confirmPW");
  if (passwordInput.value !== "" && passwordConfirm.value !== "") {
    if (passwordInput.value === passwordConfirm.value) {
      hidePasswordMismatchMessage();
    } else {
      handlePwMismatch();
    }
  } else {
    passwordInput.classList.remove("alert");
    passwordConfirm.classList.remove("alert");
  }
}

/**
 * Handles the case when the password and confirmation password inputs do not match.
 * Displays an error message indicating password mismatch and adds alert styling to the inputs.
 */
function handlePwMismatch() {
  let invalidPW = document.querySelector(".pwInvalid");
  let confirmPasswordInvalid = document.querySelector(".confirmPWInvalid");
  let passwordInput = document.getElementById("passwordField");
  let confirmPasswordInput = document.getElementById("confirmPW");

  confirmPasswordInvalid.textContent = "Ups! your password don’t match";
  invalidPW.classList.remove("hidden");
  confirmPasswordInvalid.classList.remove("hidden");
  passwordInput.classList.add("alert");
  confirmPasswordInput.classList.add("alert");
}

/**
 * Hides the password mismatch error messages.
 * Removes the "hidden" class from the password mismatch error message elements.
 */
function hidePasswordMismatchMessage() {
  let passwordMismatchMessage = document.querySelector(".pwInvalid"); // Verweise auf die entsprechenden HTML-Elemente für die Passwort-Missmatch-Meldungen
  let confirmPasswordMismatchMessage =
    document.querySelector(".confirmPWInvalid");
  let passwordInput = document.getElementById("passwordField");
  let confirmPasswordInput = document.getElementById("confirmPW");
  passwordMismatchMessage.classList.add("hidden"); // Fügt den Meldungen die Klasse "hidden" hinzu, um sie auszublenden
  confirmPasswordMismatchMessage.classList.add("hidden");
  passwordInput.classList.remove("alert");
  confirmPasswordInput.classList.remove("alert");
}

/**
 * Validates the length of the password and displays an error message if it is too short.
 * Clears the error message and styling if the password is empty.
 */
function validPwLength() {
  let passwordInput = document.getElementById("passwordField");
  let passwordInvalidDiv = document.querySelector(".pwInvalid");

  if (passwordInput.value.length === 0) {
    passwordInvalidDiv.textContent = "";
    passwordInvalidDiv.classList.add("hidden");
    passwordInput.classList.remove("alert");
  } else if (passwordInput.value.length < 4) {
    passwordInvalidDiv.textContent =
      "Password must be at least 4 characters long";
    passwordInvalidDiv.classList.remove("hidden");
    passwordInput.classList.add("alert");
  } else {
    passwordInvalidDiv.textContent = "";
    passwordInvalidDiv.classList.add("hidden");
    passwordInput.classList.remove("alert");
  }
}

/**
 * Toggles the visibility icon for the password input field based on its value and type.
 */
function togglePwType() {
  let icon = document.getElementById("pWIcon");
  let passwordInput = document.getElementById("passwordField");

  if (passwordInput.type === "password") {
    icon.src = "./assets/img/visibility.png";
    passwordInput.type = "text";
  } else {
    icon.src = "./assets/img/visibility_off.png";
    passwordInput.type = "password";
  }
}

/**
 * Toggles the visibility icon for the confirmation password input field based on its value and type.
 */
function togglePwTypeConf() {
  let icon = document.getElementById("pwIconConf");
  let passwordInput = document.getElementById("confirmPW");

  if (passwordInput.type === "password") {
    icon.src = "./assets/img/visibility.png";
    passwordInput.type = "text";
  } else {
    icon.src = "./assets/img/visibility_off.png";
    passwordInput.type = "password";
  }
}

/**
 * Validates the email input field and displays an error message if the email address is invalid.
 */
function checkEmail() {
  const emailInput = document.getElementById("emails");
  const emailError = document.querySelector(".emailInvalid");
  const email = emailInput.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  emailError.textContent = isValid ? "" : "Please enter a valid email address!";
  emailError.classList.toggle("hidden", isValid);
  emailInput.classList.toggle("alert", !isValid);
}

/**
 * Displays an error message indicating that the provided email is already registered.
 */
function userExist() {
  let emailInvalidDiv = document.querySelector(".emailInvalid");
  let emailInput = document.getElementById("emails");
  emailInvalidDiv.textContent = "The provided email is already registered.";
  emailInvalidDiv.classList.remove("hidden");
  emailInput.classList.add("alert");
}

/**
 * Displays a success message after successful user registration and hides it after a certain duration.
 */
function displaySignUpSuccessMessage() {
  let screen = document.getElementById("signUpScreen");
  screen.classList.remove("hidden");
  setTimeout(function () {
    screen.classList.add("animationOut");
    setTimeout(function () {
      screen.classList.add("hidden");
    }, 6000);
  }, 3000);
}

/**
 * Toggles the checkbox image between checked and unchecked states based on its current state. Updates the image source accordingly.
 */
function toggleSignUpCheckbox() {
  let uncheckedCheckbox = document.getElementById("checkbox");
  let checkedCheckbox = document.getElementById("checked");

  if (uncheckedCheckbox) {
    uncheckedCheckbox.src = "./assets/img/accept.png";
    uncheckedCheckbox.id = "checked";
  } else if (checkedCheckbox) {
    checkedCheckbox.src = "./assets/img/checkbutton.png";
    checkedCheckbox.id = "checkbox";
  }
}

/**
 * Ensures the sign-up button is enabled/disabled based on validation criteria before adding a user. Utilizes asynchronous validation to control button state and user addition.
 */
async function validateSignUpButton() {
  let signUpButton = document.getElementById("signUpBtn");
  const isEnabled = isButtonEnabled();

  if (isEnabled) {
    signUpButton.removeAttribute("disabled");
    addUser();
  } else {
    signUpButton.setAttribute("disabled", "disabled");
  }
}

/**
 * 
 * @returns Checks if the signup button should be enabled based on form inputs and error messages.
Returns true if all required fields are filled, no errors are displayed, and the privacy policy is accepted; otherwise, returns false.
 */
function isButtonEnabled() {
  const checkbox = document.getElementById("checked");
  const nameField = document.getElementById("names");
  const emailField = document.getElementById("emails");
  const passwordField = document.getElementById("passwordField");
  const confirmPasswordInput = document.getElementById("confirmPW");
  const invalidDivs = document.querySelectorAll(
    ".nameInvalid, .emailInvalid, .pwInvalid, .confirmPWInvalid"
  );
  const hasNoErrors = Array.from(invalidDivs).every((div) =>
    div.classList.contains("hidden")
  );
  const hasNoWarning = !document.querySelector(".alert");

  const isEnabled =
    checkbox.src.includes("accept.png") &&
    nameField.value.trim() !== "" &&
    emailField.value.trim() !== "" &&
    passwordField.value.trim() !== "" &&
    confirmPasswordInput.value.trim() !== "" &&
    hasNoErrors &&
    hasNoWarning;

  return isEnabled;
}
