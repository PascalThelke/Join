let users = [];
let newID = 0;

/**
 * Initialisiert das Sign-Up-Modul, indem die Benutzerdaten aus dem lokalen Speicher geladen werden.
 */
async function initSignUp() {
  users = JSON.parse(await getItem("users")) || [];  
}

/**
 * Adds a new user to the list of users.
 * 
 * @returns {void}
 */
async function addUser() {
  let nameInput = document.getElementById('names').value;
  let emailInput = document.getElementById('emails').value;
  let passwordInput = document.getElementById('password').value;

  let user = users.find(function(u) {                 
        return u.email === emailInput && u.password === passwordInput && u.name === nameInput;
  });
  if (user) {
    userExist()
  }
  else{
    users.push({ name: nameInput, email: emailInput, password: passwordInput });
    await setItem('users', JSON.stringify(users));
    newID += newID;
    console.log(newID);
    displaySignUpSuccessMessage();
    window.location.href = "./logIn.html";
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


// function togglePasswordIcon() {
//   const icon = document.querySelector(".pwIcon");
//   const passwordInput = document.getElementById("password");

//   const updateIcon = () => {
//     if (passwordInput.value.trim() === "") {
//       icon.src = "./assets/img/password_input.svg";
//     } else {
//       icon.src = passwordInput.type === "text" ? "./assets/img/visibility.png" : "./assets/img/visibility_off.png";
//     }
//   };
//   passwordInput.addEventListener("blur", updateIcon);
//   passwordInput.addEventListener("input", updateIcon);
// }

/**
 * Toggles the visibility icon for a password input field based on user interaction.
 */
function togglePasswordIcon() {
  let icon = document.querySelector(".pwIcon");
  let passwordInput = document.getElementById("password");

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
      if (
         passwordInput.type === "text" &&
         !icon.src.includes("visibility.svg")
      ) {
        icon.src = "./assets/img/visibility.png";
      } else if (
        passwordInput.type === "password" &&
        !icon.src.includes("visibility_off.png")
      ) {
        icon.src = "./assets/img/visibility_off.png";
      }
    }
  });
}

/**
 * Checks the validity of the password and confirmation password inputs.
 * If both inputs are non-empty, it checks if they match and calls validPwLength if they do, otherwise calls hidePasswordMismatchMessage.
 * If either input is empty, it calls handlePwMismatch.
 */
function checkPasswordValidity() {
  let passwordInput = document.getElementById("password").value;
  let confirmPWInput = document.getElementById("confirmPW").value;

  if (passwordInput.length > 0 && confirmPWInput.length > 0) {
    if (passwordInput.value === confirmPWInput.value){
      validPwLength(passwordInput, confirmPWInput);
     } else {
      hidePasswordMismatchMessage();
    }
  } else {
    handlePwMismatch();
  }
}

/**
 * Handles the case when the password and confirmation password inputs do not match.
 * Displays an error message indicating password mismatch and adds alert styling to the inputs.
 */
function handlePwMismatch() {
  let invalidPW = document.querySelector(".pwInvalid");
  let confirmPasswordInvalid = document.querySelector(".confirmPWInvalid");
  let passwordInput = document.getElementById("password");
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
    let passwordMismatchMessage = document.querySelector(".pwInvalid");     // Verweise auf die entsprechenden HTML-Elemente für die Passwort-Missmatch-Meldungen
  let confirmPasswordMismatchMessage = document.querySelector(".confirmPWInvalid");
  passwordMismatchMessage.classList.add("hidden");             // Fügt den Meldungen die Klasse "hidden" hinzu, um sie auszublenden
  confirmPasswordMismatchMessage.classList.add("hidden");
}

/**
 * Validates the length of the passwords and displays error messages if they are too short.
 * @param {string} passwordValue - The value of the password input field.
 * @param {string} confirmPasswordValue - The value of the confirmation password input field.
 */
function validPwLength(passwordValue, confirmPasswordValue) {
  let passwordInvalidDiv = document.querySelector(".pwInvalid");
  let confirmPasswordInvalidDiv = document.querySelector(".confirmPWInvalid");
  let confirmPWInput = document.getElementById('confirmPW');

  if (passwordValue.length < 4) {
    passwordInvalidDiv.textContent = "Password must be at least 4 characters long";
    passwordInvalidDiv.classList.remove("hidden");
    passwordInvalidDiv.classList.add("alert");
  } else {
    passwordInvalidDiv.classList.add("hidden");
    passwordInvalidDiv.classList.remove("alert");
  }
  if (confirmPasswordValue.length < 4) {
    confirmPasswordInvalidDiv.textContent = "Password must be at least 4 characters long";
    confirmPasswordInvalidDiv.classList.remove("hidden");
    confirmPWInput.classList.add("alert");
  } else {
    confirmPasswordInvalidDiv.classList.add("hidden");
    confirmPWInput.classList.remove("alert");
  }
}

/**
 * Toggles the visibility icon for the confirmation password input field based on its value and type.
 */
function toggleConfirmPasswordInputIcon() {
  let icon = document.querySelector(".pwInvalid");
  let input = document.getElementById("confirmPW");
  input.addEventListener("blur", function () {
    if (input.value.trim() === "") {
      icon.src = "./assets/img/password_input.svg";
    }
  });
  input.addEventListener("input", function () {
    if (input.value.trim() === "") {
      input.type = "password";
      icon.src = "./assets/img/password_input.svg";
    } else {
      if ( input.type === "text" && !icon.src.includes("visibility.png")
      ) {
        icon.src = "./assets/img/visibility.png";
      } else if ( 
         input.type === "password"   
      ) {
        icon.src = "./assets/img/visibility_off.png";
      }
    }
  });
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
  emailInvalidDiv.textContent =
    "The provided email is already registered. Please choose another email address or log in with your existing account.";
  emailInvalidDiv.classList.remove("hidden");
  emailInput.classList.add("alert");
}

/**
 * Displays a success message after successful user registration and hides it after a certain duration.
 */
function displaySignUpSuccessMessage() {
  let screen = document.getElementById("signUpScreen");
  screen.classList.remove('hidden'); 
  setTimeout(function() { 
    screen.classList.add('animationOut'); 
    setTimeout(function() { 
      screen.classList.add('hidden'); 
    }, 600000); 
  }, 300000); 
}