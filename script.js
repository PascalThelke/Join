let userName;
let userEmail;

/**
 * Initializes the application.
 */
async function init() {
    await includeHTML();
    await highlightMenuLink();
    getCurrentUser();
}


/**
 * Includes HTML files into the current document based on the 'w3-include-html' attribute.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


/**
 * Retrieves the current user's name and email from localStorage and updates the header initials accordingly.
 */
async function getCurrentUser() {
  userName = JSON.parse(localStorage.getItem("currentUserName"));
  userEmail = JSON.parse(localStorage.getItem("currentUserEmail"));
  if (userName) {
  } else {
    userName = 'Guest';
    userEmail = 'guest@test.de'
  }
  let { profileinitials } = getInitialsforHeader(userName);
  document.getElementById('header_initials').innerHTML = `${profileinitials.toUpperCase()}`;
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
    const secondName = words[1] ? words[1][0] : '';
    const profileinitials = firstName + secondName;
    return { profileinitials }; 
}

/**
 * Highlights the menu link based on the current page.
 */
async function highlightMenuLink() {
    let currentPage = window.location.pathname;
    if (currentPage === '/summary.html') {
        document.getElementById('summary_menu_link_container').style.backgroundColor = '#091931'
        document.getElementById('summary_menu_link_container').querySelector('a').style.color = 'white'
        document.getElementById('menu_icon_summary').src = './assets/img/summary_white.png'
    } else if (currentPage === '/add_task.html') {
        document.getElementById('addtask_menu_link_container').style.backgroundColor = '#091931'
        document.getElementById('addtask_menu_link_container').querySelector('a').style.color = 'white'
        document.getElementById('menu_icon_addtask').src = './assets/img/add_task_white.png'
    } else if (currentPage === '/board.html') {
        document.getElementById('board_menu_link_container').style.backgroundColor = '#091931'
        document.getElementById('board_menu_link_container').querySelector('a').style.color = 'white'
        document.getElementById('menu_icon_board').src = './assets/img/Board_white.png'
    } else if (currentPage === '/contacts.html') {
        document.getElementById('contacts_menu_link_container').style.backgroundColor = '#091931'
        document.getElementById('contacts_menu_link_container').querySelector('a').style.color = 'white';
        document.getElementById('menu_icon_contacts').src = './assets/img/contacts_white.png'
    } else if (currentPage === '/privacy_policy.html') {
        document.getElementById('privacy_policy_menulink').style.color = 'white';
    } else if (currentPage === '/legal_notice.html') {
        document.getElementById('legal_notice_menulink').style.color = 'white';
    }
}

/**
 * Toggles the visibility of a dropdown menu by adding or removing the 'd-none' class from the element with the ID 'dropdown-links'.
 */
function toggleDropDown() {
    let dropdownElement = document.getElementById('dropdown-links').classList;

    if (dropdownElement.contains('d-none')) {
        dropdownElement.remove('d-none');
    } else {
        dropdownElement.add('d-none');
    }
}


/**
 * Changes the background color of the clicked link and resets the background color of all other links with the class 'mobile-menu_link_container'.
 * @param {HTMLElement} clickedLink - The clicked link element whose background color will be changed.
 */
function changeColor(clickedLink) {
    var links = document.querySelectorAll('.mobile-menu_link_container');

    // Setze die Hintergrundfarbe aller Links zurück
    links.forEach(function (resetLink) {
        resetLink.style.backgroundColor = '#2A3647';
    });

    // Setze die Hintergrundfarbe des geklickten Links
    clickedLink.style.backgroundColor = '#091931';
}

/**
 * Updates the color of the links in the mobile menu based on the current page.
 */
function updateColorOnLoad() {
    var currentPath = window.location.pathname;
    var links = document.querySelectorAll('.mobile-menu_link_container');

    links.forEach(function (link) {
        if (link.getAttribute('href') === currentPath) {
            changeColor(link);
        }
    });
}

window.onload = updateColorOnLoad;

/**
 * Navigates back to the previous page in the browsing history.
 */
function goBack() {
    window.history.back();
}

/**
 * Prevents the event from bubbling up the DOM tree, stopping further propagation.
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
    event.stopPropagation();
}