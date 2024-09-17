import { setItem, getItem } from './storage.js';

let currentUser = [];
let currentUserName = [];
let currentUserEmail = [];
let  contactlist = []; 

/**
 * Initializes the application by loading user data and checking the login status.
 * @returns {Promise<void>}
 */
async function init() {                             
    let userData = await getItem("users");      
    users = JSON.parse(userData) || [];
    checkLoginStatus()
}

/**
 * Loads user data from storage.
 * @returns {Promise<void>}
 */
async function loadUsers() {
    try {                                               
       users = JSON.parse(await getItem('users'));
    } catch (e) {
       console.error('Loading error:', e);   
    }
}

/**
 * Logs out the guest user and redirects to the summary page.
 */
function btnGuestLog(){
    localStorage.clear();
    window.location.href = "/join/summary";
  }

/**
 * Checks the login status based on the URL parameters and performs actions accordingly.
 */
function checkLoginStatus() {
    const urlParams = new URLSearchParams(window.location.search);      
    const msg = urlParams.get('msg');
    if (msg === "Du hast dich erfolgreich ausgeloggt!") {     
      } 
      else {                                                                                   
        autoFillLoginForm();                                      
    }
}


/**
 * Autofills the login form with the saved user data from localStorage if available.
 */
function autoFillLoginForm() {
  let currentUserData = localStorage.getItem("currentUser"); 
  let emailInputField = document.getElementById('email'); 
  let passwordInputField = document.getElementById('password'); 

  if (currentUserData) {
      let currentUser = JSON.parse(currentUserData); 
      emailInputField.value = currentUser.email; 
      passwordInputField.value = currentUser.password; 
      logIn(); 
}
}

/**
 * Handles the login process.
 * @param {Event} event - The event object.
 */
function logIn(event) {    
      event.preventDefault();
      console.log('event');
    let emailInput = document.getElementById("email");      
    let passwordInput = document.getElementById("passwordInput");
     let user = users.find(function(u) {                 
        return u.email === emailInput.value && u.password === passwordInput.value;
      });
    if (user) { 
      storeUserData(user);                                        
       window.location.href = "../summary.html"; 
      } else {                                              
        showUserPasswordMismatch(); 
      }
  }


/**
 * Stores user data in local storage.
 * @param {Object} user - The user object containing email, password, and name.
 */
function storeUserData(user) {          
  let userEmail = user.email; // E-Mail-Adresse des Benutzers extrahieren
  let userPassword = user.password; // Passwort des Benutzers extrahieren
  let username = user.name; // Benutzername extrahieren

  currentUserName.push(username); // Benutzername zum Array currentUserName hinzufügen
  currentUserEmail.push(userEmail);
  saveDataToLocalStorage("currentUserName", currentUserName); // Benutzernamen im lokalen Speicher speichern
  saveDataToLocalStorage("currentUserEmail", userEmail);

  if (document.getElementById('rememberMe').checked == true) {
      currentUser.push({ email: userEmail, password: userPassword }); // E-Mail und Passwort zum Array currentUser hinzufügen, falls "Remember Me" aktiviert ist
      saveDataToLocalStorage("currentUser", currentUser); // E-Mail und Passwort im lokalen Speicher speichern, falls "Remember Me" aktiviert ist
  }
}

/**
 * Saves data to local storage under the specified key.
 * @param {string} key - The key under which the data will be stored in local storage.
 * @param {any} data - The data to be stored in local storage.
 */
function saveDataToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data)); // Daten im lokalen Speicher unter dem angegebenen Schlüssel speichern
}

/**
 * Changes the password input icon based on user interaction.
 */
function changePasswordInputIcon() {
  let icon = document.querySelector(".passwordIcon");
  let passwordInput = document.getElementById("passwordInput");

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
 * Toggles the visibility of the password input field.
 */
function togglePasswordInputType() {
  let icon = document.querySelector(".passwordIcon");
  let passwordInput = document.getElementById("passwordInput");

  if (passwordInput.type === "password") {
    icon.src = "./assets/img/visibility.png";
    passwordInput.type = "text";
  } else {
    icon.src = "./assets/img/visibility_off.png";
    passwordInput.type = "password";
  }
}

/**
 * Displays a message indicating incorrect email address or password and adds alert styling to input fields.
 */
function showUserPasswordMismatch() {
  let passwordInput = document.getElementById("passwordInput");
  let passwordInvalidDiv = document.querySelector(".passwordInvalidDiv");
  passwordInvalidDiv.textContent = "Incorrect Email adress or password.";
  passwordInvalidDiv.classList.remove("hidden");
  passwordInput.classList.add("alert");

  let emailInput = document.getElementById("email");
  let emailInvalidDiv = document.querySelector(".emailInvalid");
  emailInvalidDiv.textContent = "Incorrect Email adress or password.";
  emailInvalidDiv.classList.remove("hiden");
  emailInput.classList.add("alert");
}

/**
 * Checks the validity of the email input field and displays an error message if the email is invalid.
 */
function checkEmailValidity() {
    const emailInput = document.getElementById("email");
    const emailError = document.querySelector(".emailInvalid");
    const email = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
    emailError.textContent = isValid ? "" : "Please enter a valid email address!";
    emailError.classList.toggle("hidden", isValid);
    emailInput.classList.toggle("alert", !isValid);
  }

  /**
 * Checks the validity of the password input field and displays an error message if the password length is less than 8 characters.
 */
function checkPasswordValidity() {
    let passwordInput = document.getElementById("passwordInput");
    let passwordInvalidDiv = document.querySelector(".passwordInvalidDiv");
  
    if (passwordInput.value.length < 8 && passwordInput.value.length !== 0) {
      showPasswordLengthInvalid();
    } else {
      passwordInvalidDiv.classList.add("hidden");
      passwordInput.classList.remove("alert");
    }
  }


  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(startFadeOut, 1000);
  
    function startFadeOut() {
      let modalElement = document.getElementById("landing_page");
      modalElement.classList.add("fade-out");
      setTimeout(function () {
        modalElement.style.display = "none";
      }, 500);
    }
  });


 /**
 * Toggles the appearance of the login checkbox image between "accept.png" and "checkbutton.png", and performs corresponding actions based on its state.
 */ 
  function toggleLoginCheckbox() {
    let uncheckedCheckbox = document.getElementById("unchecked");
    let checkedCheckbox = document.getElementById("checked");
  
    if (uncheckedCheckbox) {
      uncheckedCheckbox.src = "./assets/img/accept.png";
      uncheckedCheckbox.id = "checked";
      rememberInputData();
    } else if (checkedCheckbox) {
      checkedCheckbox.src = "./assets/img/checkbutton.png";
      checkedCheckbox.id = "unchecked";
      clearStoredInput();
      clearInputFields();
    }
}
  
/**
 * Stores the user's email and password input values in the browser's local storage.
 */
  function rememberInputData() {
    let userEmail = document.getElementById("email").value;
    let userPassword = document.getElementById("passwordInput").value;

    localStorage.setItem("email", userEmail);
    localStorage.setItem("password", userPassword);
  }
  
  /**
 * Clears the input fields for email and password.
 */
  function clearInputFields() {
    document.getElementById("email").value = "";
    document.getElementById("passwordInput").value = "";
  }