/**
 * Retrieves message parameter from the URL query string and displays it in the sign-up screen if present.
 * Hides the sign-up screen if no message parameter is found.
 */
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");
let msgBox = document.getElementById("signUpScreen");

if (msg) {
  // msgBox.innerHTML = msg;
  msgBox.classList.remove("hidden");
} else {
  msgBox.classList.add("hidden");
}
