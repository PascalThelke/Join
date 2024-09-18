/**
 *  This function is used to render an empty contactlist with alphabethical rows.
 *
 * @param {string} singleLetter - This is the letter for each row in the contactlist.
 */
function renderContactList() {
  document.getElementById("contact_list").innerHTML = ``;
  renderContactlistTop();
  for (let i = 0; i < alphabet.length; i++) {
    const singleLetter = alphabet[i];
    document.getElementById("contact_list").innerHTML += `
        <div id="contactlist_alphabet_sorting_container${i}"> 
            ${singleLetter}  
        </div>
        <div class="divide_container" id="divide_container_${i}">
            <img src="./assets/contactbook/icons_contactbook/Vector 10.svg" alt="">
        </div>
            <div id="contact_list_names${i}">
        </div>
    `;
  }
  renderContactsToList();
  renderInitialsOfUser();
}

/**
 * Renders the top section of the contact list with options for adding a new contact.
 */
function renderContactlistTop() {
  document.getElementById("contact_list").innerHTML = `
    <div class="contactlist_button_container">
        <button onclick="showAddContactDialog()">
            Add new contact <img src="./assets/contactbook/icons_contactbook/person_add.svg" alt="">
        </button>
    </div>
    <div class="contact_list_container" id="contact_me" renderContact('me', 'me')>
    <div id="contact_list_initals" class="">
    </div>
    <div class="column gap8">
        <div id="contact_list_name">
            ${userName}(Me)
        </div>
        <a id="contact_list_mail}">
            ${userEmail}
        </a>
    </div>
</div>
    <div></div>
    `;
}

/**
 * This function renders contacts into their corresponding alphabetical container within the contact list.
 *
 * @param {HTMLElement} namesContainer - Container for displaying contact names.
 * @param {HTMLElement} alphabetContainer - Container for displaying the corresponding letter.
 * @param {Array} contactsStartingWithLetter - Array of contacts starting with the same letter.
 * @param {number} alphabetIndex - Index of the current alphabet letter.
 */
function renderIntoAlphabetContainer(
  namesContainer,
  alphabetContainer,
  contactsStartingWithLetter,
  alphabetIndex
) {
  namesContainer.innerHTML = "";
  alphabetContainer.style.display = "flex";
  contactsStartingWithLetter.forEach((contact, contactIndex) => {
    let { profileinitials, secondName } = getInitials(contact);
    let contactName = "";
    let contactMail = "";
    if (contact.contact && contact.contact.name && contact.contact.mail) {
      contactName = contact.contact.name;
      contactMail = contact.contact.mail;
    } else if (contact.name && contact.mail) {
      contactName = contact.name;
      contactMail = contact.mail;
    }
    namesContainer.innerHTML += `
        <div class="contact_list_container" id="contact_${alphabetIndex}_${contactIndex}" onclick="renderContact(${alphabetIndex},${contactIndex})">
            <div id="contact_list_initals${alphabetIndex}" class="letter-${secondName.toLowerCase()}">
                ${profileinitials}
            </div>
            <div class="column gap8">
                <div id="contact_list_name${alphabetIndex}">
                    ${contactName}
                </div>
                <a id="contact_list_mail${alphabetIndex}">
                    ${contactMail}
                </a>
            </div>
        </div>
        `;
  });
}

/**
 * This function renders detailed information about a contact when selected from the contact list.
 *
 * @param {number} alphabetIndex - Index of the corresponding alphabetical row.
 * @param {number} contactIndex - Index of the selected contact.
 */
function renderContact(alphabetIndex, contactIndex) {
  // Überprüfen, ob 'contact.contact.name' oder 'contact.name' verwendet werden soll
  const contact = contactList.filter((contact) => {
    if (contact.contact && contact.contact.name) {
      return (
        contact.contact.name.charAt(0).toUpperCase() === alphabet[alphabetIndex]
      );
    } else if (contact.name) {
      return contact.name.charAt(0).toUpperCase() === alphabet[alphabetIndex];
    }
    return false;
  })[contactIndex];

  // Initialen abrufen
  const { profileinitials, secondName } = getInitials(contact);

  let contactoverview = document.getElementById("contact_overview");
  contactoverview.style.display = "flex";
  contactoverview.style.transform = "translateX(200%)";

  setTimeout(() => {
    // Überprüfen, ob 'contact.contact' oder 'contact' direkt verwendet wird
    let contactName = "";
    let contactMail = "";
    let contactPhone = "";

    if (
      contact.contact &&
      contact.contact.name &&
      contact.contact.mail &&
      contact.contact.phone
    ) {
      contactName = contact.contact.name;
      contactMail = contact.contact.mail;
      contactPhone = contact.contact.phone;
    } else if (contact.name && contact.mail && contact.phone) {
      contactName = contact.name;
      contactMail = contact.mail;
      contactPhone = contact.phone;
    }

    // HTML-Template mit den richtigen Werten befüllen
    contactoverview.innerHTML = ` 
        <div class="contact_information_container">
            <img onclick="closeContact()" src="./assets/img/arrow-left-line.png" alt="">
            <div id="contact_overview_top">
                <div class="contact_list_overview_initals letter-${secondName.toLowerCase()}">
                    ${profileinitials}
                </div>
                <div class="contact_overview_name_container column">
                    <div id="contact_overview_name">
                        ${contactName}
                    </div>
                    <div class="flex marginL-24">
                        <div id="contactlist_edit_icon_container" onclick="openEditContact(${alphabetIndex}, ${contactIndex})">
                            <span>Edit</span>
                        </div>
                        <div id="contactlist_delete_icon_container" onclick="deleteContact()">
                            <span>Delete</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="contact_information">
            </div>
            <div class="contact_overview_footer">
                <div class="contact_overview_footer_container">
                    <b>Email</b>
                    <a href="mailto:${contactMail}" id="contact_overview_mail">
                        ${contactMail}
                    </a>
                </div>
                <div class="contact_overview_footer_container">
                    <b>Phone</b>
                    <a href="tel:${contactPhone}" id="contact_overview_phone">
                        ${contactPhone}
                    </a>
                </div>
            </div>
        </div>
      `;
    addHighlightsToContact(alphabetIndex, contactIndex);
    contactoverview.style.transform = "translateX(0%)";
  }, 125);

  const addContactOptionsButton = document.getElementById(
    "contactlist_add_contact_options_button"
  );
  if (window.innerWidth < 1210) {
    addContactOptionsButton.style.display = "flex";
  } else {
    addContactOptionsButton.style.display = "none";
  }
  document.getElementById("contactlist_add_contact_button").style.display =
    "none";
}

/**
 * Renders the contact overlay for adding or editing contacts.
 *
 * This function dynamically generates the HTML content for the contact overlay and inserts it into the 'contactlist_overlay_container' element.
 * It includes input fields for entering contact information (name, email, phone), buttons for canceling, saving, and editing contacts, and icons for visual representation.
 * The overlay also includes event listeners for handling user interactions such as closing the overlay, submitting the form, and updating the initials display.
 */
function renderContactOverlay() {
  document.getElementById("contactlist_overlay_container").innerHTML = `
    <div class="contactlist_mid_layer">
            <div onclick="noClose(event)" id="add_contact_overlay">
                <div class="left_side_add_contact_overlay">
                    <div class="add_contact_close_container_handy">
                        <img onclick="closeAddContactDialog()"
                            src="./assets/contactbook/icons_contactbook/close_white.svg" alt="">
                    </div>
                    <img id="contact_list_logo_handy" src="./assets/contactbook/img_contactbook/join_logo.svg" alt="">
                    <div class="add_contact_overlay_text_container">
                        <span id="add_contact_headline">Add contact</span>
                        <span id="under_headline">Tasks are better with a team!</span>
                        <img src="./assets/contactbook/icons_contactbook/dividing_bar_blue_horizontal.svg" alt="">
                    </div>
                </div>
                <div class="right_side_add_contact_overlay">
                    <div class="center_up mb50">
                        <div id="contact_initials_container">
                            <img class="hw64" src="./assets/contactbook/icons_contactbook/person_white.svg" alt="">
                        </div>
                    </div>
                    <div class="center_up mb50">
                        <div class="edit_formular_container">
                            <div class="add_contact_close_container">
                                <img onclick="closeAddContactDialog()"
                                    src="./assets/contactbook/icons_contactbook/close.svg" alt="">
                            </div>
                            <form onsubmit="handleSubmit(); return false;">
                                <div class="input_container">
                                    <input onkeyup="getInitialsForOverlay()" required type="text" placeholder="Name" id="contactlist_name_input"
                                        title="Please enter a name with at least 2 characters, a space, and the last name with at least 3 characters"
                                        pattern="[a-zA-Z]{2,}\\s[a-zA-Z]{3,}">
                                    <img src="./assets/contactbook/icons_contactbook/person.svg" alt="">
                                </div>
                                <div class="input_container">
                                    <input required type="email" placeholder="E-Mail" id="contactlist_mail_input"
                                        title="Please enter a valid email address">
                                    <img src="./assets/contactbook/icons_contactbook/mail.svg" alt="">
                                </div>
                                <div class="input_container">
                                    <input required type="text" placeholder="Phone" id="contactlist_phone_input"
                    
                                        title="Please enter a valid phone number in the format +49 333 333 333 33">
                                    <img src="./assets/contactbook/icons_contactbook/call.svg" alt="">
                                </div>
                                <div class="edit_contact_button_container">
                                    <button type="button" id="contact_cancel_button" onclick="resetAddContactForm();">
                                        Cancel ✖
                                    </button>
                                    <button id="contact_save_button">
                                        Create contact <img src="./assets/contactbook/icons_contactbook/check.svg"
                                            alt="">
                                    </button>
                                    <button id="contact_edit_button" class="center">
                                        Save <img src="./assets/contactbook/icons_contactbook/check.svg" alt="">
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renders the initials of the current user in the contact list.
 */
function renderInitialsOfUser() {
  let { profileinitials, secondName } = getInitialsforUser(String(userName));
  document.getElementById("contact_list_initals").innerHTML = profileinitials;
  document
    .getElementById("contact_list_initals")
    .classList.add(`letter-${secondName.toLowerCase()}`);
}
