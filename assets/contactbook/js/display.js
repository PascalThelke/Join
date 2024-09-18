/**
 * Adds highlights to the selected contact in the contact list.
 * 
 * @param {number} alphabetIndex - Index of the corresponding alphabetical row.
 * @param {number} contactIndex - Index of the selected contact.
 */
function addHighlightsToContact(alphabetIndex, contactIndex) {
    const allContactContainers = document.querySelectorAll('.contact_list_container');
    allContactContainers.forEach(container => {
        container.classList.remove('selected');
    });
    const selectedContainer = document.getElementById(`contact_${alphabetIndex}_${contactIndex}`);
    selectedContainer.classList.add('selected');
}


/**
 * Closes the contact overview.
 * 
 * This function sets a timeout to hide the contact overview after 125 milliseconds.
 * It also sets the transform style property to move the contact overview off-screen horizontally.
 * Additionally, it displays the 'Add Contact' button and hides the 'Add Contact Options' button.
 */
function closeContact() {
    setTimeout(() => {
        document.getElementById('contact_overview').style.display = "none";
    }, 125);
    document.getElementById('contact_overview').style.transform = 'translateX(200%)';
    document.getElementById('contactlist_add_contact_button').style.display = 'flex';
    document.getElementById('contactlist_add_contact_options_button').style.display = 'none';
}


/**
 * This function is used to show the add contact overlay by clicking the 'add new contact' button.
 */
function showAddContactDialog() {
    renderContactOverlay();
    document.getElementById('contactlist_overlay_container').style.display = 'unset';
    document.getElementById('contact_edit_button').style.display = 'none';
    document.getElementById('under_headline').style.display = 'flex';
    document.getElementById('contact_save_button').style.display = 'flex';
    document.getElementById('contact_cancel_button').style.display = 'flex';
    document.getElementById('add_contact_headline').innerHTML = 'Add contact';
    document.getElementById('contactlist_name_input').value = '';
    document.getElementById('contactlist_mail_input').value = '';
    document.getElementById('contactlist_phone_input').value = '';
    setTimeout(() => {
        document.getElementById('add_contact_overlay').style = 'transform: translateX(0%)';
    }, 100);
}

/**
 * Displays the add contact dialog in low resolution.
 * 
 * This function renders the contact overlay for adding or editing contacts using the 'renderContactOverlay' function.
 * It sets the display style of the 'contactlist_overlay_container' element to 'unset' to make the overlay visible.
 * Additionally, it animates the 'add_contact_overlay' element by setting its transform style to 'translateY(0%)' after a delay of 100 milliseconds.
 */
function showAddContactDialogLowRes() {
    renderContactOverlay();
    document.getElementById('contactlist_overlay_container').style.display = 'unset';
    setTimeout(() => {
        document.getElementById('add_contact_overlay').style = 'transform: translateY(0%)';
    }, 100);
}


/**
 * This function is given the backgorundcontainer of the overlay to close it by clicking in the background of the overlay.
 */
function closeAddContactDialog() {
    const addContactOverlay = document.getElementById('add_contact_overlay');
    const contactListOverlayContainer = document.getElementById('contactlist_overlay_container');
    if (window.matchMedia("(max-width: 1210px)").matches) {
        addContactOverlay.style.transform = 'translateY(200%)';
    } else {
        addContactOverlay.style.transform = 'translateX(200%)';
    }
    setTimeout(() => {
        contactListOverlayContainer.style.display = 'none';
        renderContactList();
    }, 100);
    document.getElementById('contact_cancel_button').innerHTML = 'Cancel ✖';
    closeAddContactOptionsLowRes();
}


/**
 * Displays the success button for creating a contact.
 * Adjusts the position of the button based on the window width,
 * animates the button into view, and then hides it after a delay.
 */
function showSuccessButton() {
    let successButton = document.getElementById('create_contact_success_button');
    if (window.innerWidth > 1210) {
        successButton.style.display = 'flex';
        successButton.style.bottom = '110px';
        successButton.style.right = '346px';
    } else {
        successButton.style.display = 'flex';
        successButton.style.bottom = '96px';
        successButton.style.right = '148px';
    }
    setTimeout(() => {
        successButton.style.transform = 'translateY(0%)';
    }, 125);
    setTimeout(() => {
        successButton.style.display = 'none';
    }, 1000);
    successButton.style.transform = 'translateY(400%)';
}

/**
 * Displays the success button after adding a new contact.
 * The button appears temporarily and then fades out.
 */
function showSuccessButtonEdit() {
    let successButton = document.getElementById('edit_contact_success_button');
    if (window.innerWidth > 1210) {
        successButton.style.display = 'flex';
        successButton.style.bottom = '110px';
        successButton.style.right = '346px';
    } else {
        successButton.style.display = 'flex';
        successButton.style.bottom = '96px';
        successButton.style.right = '148px';
    }
    setTimeout(() => {
        successButton.style.transform = 'translateY(0%)';
    }, 125);
    setTimeout(() => {
        successButton.style.display = 'none';
    }, 1000);
    successButton.style.transform = 'translateY(400%)';
}


/**
 * Displays the success button after deleting a contact.
 * The button appears temporarily and then fades out.
 */
function showSuccessButtonDelete() {
    let successButton = document.getElementById('delete_contact_success_button');
    if (window.innerWidth > 1210) {
        successButton.style.display = 'flex';
        successButton.style.bottom = '110px';
        successButton.style.right = '346px';
    } else {
        successButton.style.display = 'flex';
        successButton.style.bottom = '96px';
        successButton.style.right = '148px';
    }
    setTimeout(() => {
        successButton.style.transform = 'translateY(0%)';
    }, 125);
    setTimeout(() => {
        successButton.style.display = 'none';
    }, 1000);
    successButton.style.transform = 'translateY(400%)';
}


/**
 * Updates the add contact dialog to display contact information for editing.
 * Displays the edit button, hides the under headline, hides the save button,
 * changes the cancel button text to "Delete", updates the headline to "Edit contact",
 * and populates the input fields with the contact's name, email, and phone number.
 * 
 * @param {object} contact - The contact object containing name, mail, and phone properties.
 */
function changeAddContactoverlay(contact) {
    document.getElementById('contact_edit_button').style.display = 'flex';
    document.getElementById('under_headline').style.display = 'none';
    document.getElementById('contact_save_button').style.display = 'none';
    document.getElementById('contact_cancel_button').innerHTML = 'Delete';
    document.getElementById('add_contact_headline').innerHTML = 'Edit contact';
    document.getElementById('contactlist_name_input').value = contact.contact.name;
    document.getElementById('contactlist_mail_input').value = contact.contact.mail;
    document.getElementById('contactlist_phone_input').value = contact.contact.phone;
}


/**
 * Displays the add contact options dropdown menu in low-resolution mode.
 * Shows the dropdown overlay and animates the dropdown options into view.
 */
function showAddContactOptionsLowRes() {
    document.getElementById('dropdown_overlay').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('dropdown_options').style.transform = 'translateX(0%)';
    }, 125);
}


/**
 * Closes the add contact options dropdown menu in low-resolution mode.
 * Animates the dropdown options out of view and hides the dropdown overlay.
 */
function closeAddContactOptionsLowRes() {
    document.getElementById('dropdown_options').style.transform = 'translateX(120%)';
    setTimeout(() => {
        document.getElementById('dropdown_overlay').style.display = 'none';
    }, 125);
}