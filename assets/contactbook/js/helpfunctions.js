/**
 * This function is used to stop the overlay from closing by clicking in it, because its a childcontainer of the clickable 'to close' container in the background.
 *
 * @param {string} event -  In this case its the Mouseclick on the Element thats a child of the 'to close' container in the background.
 */
function noClose(event) {
  event.stopPropagation();
}

/**
 * Retrieves initials for a given contact's name.
 *
 * @param {string} contact - The name of the contact.
 * @returns {Object} An object containing profile initials and the second name's initial.
 */
function getInitials(contact) {
  let name = "";
  if (contact.contact && contact.contact.name) {
    name = contact.contact.name;
  } else if (contact.name) {
    name = contact.name;
  } else {
    return { profileinitials: "", secondName: "" }; // Falls kein Name vorhanden ist
  }

  const words = name.split(" ");
  const firstName = words[0][0];
  const secondName = words[1] ? words[1][0] : "";
  const profileinitials = firstName + secondName;

  return { profileinitials, secondName };
}

/**
 * Generates initials based on the input name and displays them in the contact overlay.
 * If the input name consists of two or more words, it takes the first letter of each word.
 * Adds a class to the initials container based on the second letter for styling purposes.
 */
function getInitialsForOverlay() {
  let nameInput = document.getElementById("contactlist_name_input").value;
  let initialsContainer = document.getElementById("contact_initials_container");
  let initials = nameInput.split(" ");
  let firstLetter = initials[0][0];
  let secondLetter = initials[1] ? initials[1][0] : "";
  initialsContainer.classList.add(`letter-${secondLetter.toLowerCase()}`);
  initialsContainer.innerHTML = `${firstLetter + secondLetter}`;
}

/**
 * Renders contacts into their corresponding alphabetical rows within the contact list.
 * If no contacts start with a certain letter, hides the corresponding containers.
 */
function getInitialsforUser(contact) {
  const words = contact.split(" ");
  const firstName = words[0][0];
  const secondName = words[1] ? words[1][0] : "";
  const profileinitials = firstName + secondName;
  return { profileinitials, secondName };
}

/**
 * Removes an invalid entry from the given array at index 9.
 * After removal, updates the 'contactList' item in the storage with the updated array.
 *
 * @param {Array} array - The array from which the invalid entry is to be removed.
 */
async function removeInvalidEntries(array) {
  array.splice(9, 1);
  await setItem("contactList", JSON.stringify(contactList));
}

/**
 * Finds the alphabet index and contact index for a given contact in the contact list.
 *
 * This function takes a contact object as input and extracts the first letter of the contact's name to determine its alphabetical index.
 * It then finds the corresponding alphabetical row in the contact list using the 'alphabet' array and returns the index.
 * Additionally, it finds the index of the contact within the filtered list of contacts starting with the same letter and renders detailed information about the contact using the 'renderContact' function.
 *
 * @param {Object} contact - The contact object for which to find the alphabet index and contact index.
 */
function findAlphabetIndex(contact) {
  let firstLetter;
  if (contact.contact && contact.contact.name) {
    firstLetter = contact.contact.name.charAt(0).toUpperCase();
  } else if (contact.name) {
    firstLetter = contact.name.charAt(0).toUpperCase();
  } else {
    return;
  }
  const alphabetIndex = alphabet.indexOf(firstLetter);
  let contactsStartingWithLetter;
  contactsStartingWithLetter = contactList.filter((contact) => {
    if (contact.contact && contact.contact.name) {
      return contact.contact.name.charAt(0).toUpperCase() === firstLetter;
    } else if (contact.name) {
      return contact.name.charAt(0).toUpperCase() === firstLetter;
    }
    return false;
  });

  const contactIndex = contactsStartingWithLetter.indexOf(contact);
  renderContact(alphabetIndex, contactIndex);
}

/**
 * Deletes a contact from the contact list without confirmation.
 *
 * This function retrieves the name and email of the contact to be deleted from the contact overview section.
 * It then finds the index of the contact to be deleted in the contact list based on its name and email.
 * If the contact is found (index is not -1), it is removed from the contact list.
 * The updated contact list is then stored in the backend storage.
 * Finally, it renders the updated contact list and hides the contact overview section.
 */
async function deleteContactWithoutConfirm() {
  const contactName = document
    .getElementById("contact_overview_name")
    .innerText.trim();
  const contactMail = document
    .getElementById("contact_overview_mail")
    .innerText.trim();

  const indexToDelete = contactList.findIndex(
    (contact) =>
      contact.contact.name === contactName &&
      contact.contact.mail === contactMail
  );

  const contactId = contactList[indexToDelete].id;
  await deleteItem(`contacts/${contactId}`);
  contactList.splice(indexToDelete, 1);
  initContactList();
  document.getElementById("contact_overview").style.transform =
    "translateX(200%)";
    showSuccessButtonEdit();
}

/**
 * Handles the form submission for adding or editing a contact.
 * Disables the form buttons during submission to prevent multiple submissions.
 * Depending on the button clicked (Save or Edit), it either adds a new contact or updates an existing contact.
 * Enables the form buttons after submission.
 *
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} A Promise that resolves after adding or updating the contact.
 */
async function handleSubmit() {
  const cancelButton = document.getElementById("contact_cancel_button");
  const saveButton = document.getElementById("contact_save_button");
  const editButton = document.getElementById("contact_edit_button");
  cancelButton.disabled = true;
  saveButton.disabled = true;
  editButton.disabled = true;
  if (event.submitter === saveButton) {
    await addToContacts();
    showSuccessButton();
  } else if (event.submitter === editButton) {
    await updateContact();
    showSuccessButtonEdit();
  }
  cancelButton.disabled = false;
  saveButton.disabled = false;
  editButton.disabled = false;
}
