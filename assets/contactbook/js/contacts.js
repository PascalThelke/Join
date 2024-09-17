const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
let contactList = [];

/**
 * Initializes the contact list by calling other initialization functions and rendering the contact list.
 *
 * @returns {Promise<void>} A Promise that resolves once the contact list is initialized and rendered.
 */
async function initContactList() {
  await init();
  await loadContactList();
  renderContactList();
}

/**
 * Asynchronously loads the contact list from the backend storage.
 * If successful, updates the global variable 'contactList' with the parsed JSON data.
 *
 * @param {Array} contactList - This variable receives the parsed JSON data from the backend.
 */
async function loadContactList() {
  try {
    // Attempt to parse the JSON data retrieved from the backend storage using 'getItem'
    contactListResponse = await getItem("contactList");
    console.log("response", contactListResponse);
    let contactKeysArray = Object.keys(contactListResponse);
    console.log("key response", contactKeysArray);

    contactKeysArray.forEach((contact) => {
        contactList.push(
            {
                id: contact,
                contact: contactListResponse[contact],
            }
        )
    });

    console.log("as array", contactList);
  } catch (e) {
    // If an error occurs during parsing or retrieval, log the error to the console
    console.error("Loading error:", e);
  }
}

/**
 * Renders contacts into their corresponding alphabetical rows within the contact list.
 * If no contacts start with a certain letter, hides the corresponding containers.
 *
 * @param {Array} contactList - The array containing all contacts.
 * @param {Array} alphabet - The array containing all alphabets.
 * @param {HTMLElement[]} namesContainers - An array of HTML elements representing containers for displaying contact names.
 * @param {HTMLElement[]} alphabetContainers - An array of HTML elements representing containers for displaying alphabetical sorting.
 * @param {HTMLElement[]} divideContainers - An array of HTML elements representing containers for dividing sections.
 */
function renderContactsToList() {
  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];
    console.log('contactlist before filtering:',contactList)
    const contactsStartingWithLetter = contactList.filter(
      (contact) => contact.contact.name.charAt(0).toUpperCase() === letter
    );
    const namesContainer = document.getElementById(`contact_list_names${i}`);
    const alphabetContainer = document.getElementById(
      `contactlist_alphabet_sorting_container${i}`
    );
    const divideContainer = document.getElementById(`divide_container_${i}`);
    if (contactsStartingWithLetter.length === 0) {
      namesContainer.style.display = "none";
      alphabetContainer.style.display = "none";
      divideContainer.style.display = "none";
    } else {
      renderIntoAlphabetContainer(
        namesContainer,
        alphabetContainer,
        contactsStartingWithLetter,
        i
      );
    }
  }
}

/**
 * Opens the edit contact dialog.
 * This function is triggered when the user wants to edit a contact from the contact list.
 * It retrieves the contact details based on the provided indices, shows the add contact dialog,
 * and populates it with the details of the selected contact.
 *
 * @param {number} alphabetIndex - Index of the corresponding alphabetical row.
 * @param {number} contactIndex - Index of the selected contact.
 */
function openEditContact(alphabetIndex, contactIndex) {
  const contact = contactList.filter(
    (contact) =>
      contact.contact.name.charAt(0).toUpperCase() === alphabet[alphabetIndex]
  )[contactIndex];
  showAddContactDialog();
  changeAddContactoverlay(contact);
  getInitialsForOverlay();
}

/**
 * Updates a contact after editing.
 *
 * This function first deletes the contact without asking for confirmation,
 * then adds the edited contact to the contact list,
 * and finally shows a success button indicating that the contact was edited successfully.
 *
 * Note: This function does not handle user confirmation for deletion or editing.
 *
 * @returns {Promise<void>} A Promise that resolves once the contact is updated.
 */
async function updateContact() {
  deleteContactWithoutConfirm();
  addToContacts();
  showSuccessButtonEdit();
}

/**
 * This function creates a json from the inputs of the 'add contact' overlay and pushes it into the contactlist Array and saves it in the backend.
 *
 * @param {string} contact - This is the json with all informations from the inputfield. It will be pushed into contactlist.
 */
async function addToContacts() {
  let saveContactButton = document.getElementById("contact_save_button");
  saveContactButton.disabled = true;
  let name = document.getElementById("contactlist_name_input");
  let mail = document.getElementById("contactlist_mail_input");
  let phone = document.getElementById("contactlist_phone_input");
  let contact = {
    name: name.value,
    mail: mail.value,
    phone: phone.value,
  };
  let contactKeysArray = Object.keys(contactListResponse);

  contactList.push({
    // id: contactKeysArray[contact],
    // contact: contactList[contactKeysArray[contact]],
    name: name.value,
    mail: mail.value,
    phone: phone.value,
  });

  console.log(contactList);
  // contactList.push(contact);
  await postItem("contactList", contact);
  resetAddContactForm(name, mail, phone);
  closeAddContactDialog();
  renderContactList();
  findAlphabetIndex(contact);
  saveContactButton.disabled = false;
}

/**
 * This function is just to reset the inputfields of the 'add contact' overlay.
 *
 * @param {string} name - It's the inputfield where the name is written in.
 * @param {string} mail - It's the inputfield where the e-mail is written in.
 * @param {string} phone - It's the inputfield where the phonenumber is written in.
 */
function resetAddContactForm() {
  document.getElementById("contactlist_name_input").value = "";
  document.getElementById("contactlist_mail_input").value = "";
  document.getElementById("contactlist_phone_input").value = "";
}

/**
 * Deletes a contact from the 'contactList' array.
 * Prompts the user for confirmation before deleting.
 * After deletion, updates the 'contactList' item in the storage and re-renders the contact list.
 * Displays a success button for deleting the contact.
 */
async function deleteContact() {
  const contactName = document
    .getElementById("contact_overview_name")
    .innerText.trim();
  const contactMail = document
    .getElementById("contact_overview_mail")
    .innerText.trim();
  const indexToDelete = contactList.findIndex(
    (contact) => contact.contact.name === contactName && contact.mail === contactMail
  );
  if (indexToDelete !== -1) {
    const confirmDelete = confirm(
      "Are you sure you want to edit/delete this contact?"
    );
    if (confirmDelete) {
      contactList.splice(indexToDelete, 1);
    } else {
      return;
    }
    await setItem("contactList", JSON.stringify(contactList));
    renderContactList();
    document.getElementById("contact_overview").style.transform =
      "translateX(200%)";
  }
  showSuccessButtonDelete();
}

/**
 * Asynchronously opens the edit contact dialog in low-resolution screens.
 * Retrieves the contact information from the contact overview, displays the add contact dialog,
 * populates it with the contact information, and retrieves the initials for the overlay.
 */
async function openEditContactLowRes() {
  const contactName = document
    .getElementById("contact_overview_name")
    .innerText.trim();
  const contactMail = document
    .getElementById("contact_overview_mail")
    .innerText.trim();
  const contact = contactList.find(
    (contact) => contact.contact.name === contactName && contact.mail === contactMail
  );
  if (!contact) {
    console.error("Contact not found.");
    return;
  }
  showAddContactDialog();
  changeAddContactoverlay(contact);
  getInitialsForOverlay();
}
