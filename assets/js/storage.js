// const STORAGE_TOKEN = 'QDZWF0M731P6BJUN86LFPQFS6VZ8PUSF08W8Y1A2';
// const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Sets an item in the storage with the specified key and value.
 * @param {string} key - The key under which to store the value.
 * @param {string} value - The value to be stored.
 * @returns {Promise} - A Promise that resolves with the result of the operation.
 */
// async function setItem(key, value) {
//     const payload = { key, value, token: STORAGE_TOKEN };
//     return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
//         .then(res => res.json());
// }

/**
 * Retrieves the value associated with the specified key from the storage.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise} - A Promise that resolves with the retrieved value.
 * @throws {string} - Throws an error if the data with the specified key is not found.
 */
// async function getItem(key) {
//     const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
//     return fetch(url)
//         .then(res => res.json())
//         .then(res => {
//             if (res.data) {
//                 return res.data.value;
//             }
//             throw `Could not find data with key "${key}".`;
//         });
// }

const STORAGE_URL =
  "https://join-79db1-default-rtdb.europe-west1.firebasedatabase.app/";

async function getItem(path = "") {
  let response = await fetch(STORAGE_URL + path + ".json");
  return (responseToJson = await response.json());
}

async function postItem(path = "", data = {}) {
  let response = await fetch(STORAGE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

async function deleteItem(path = "", data = {}) {
  let response = await fetch(STORAGE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

async function setItem(path = "", data = {}) {
  let response = await fetch(STORAGE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}
