const STORAGE_TOKEN = 'QDZWF0M731P6BJUN86LFPQFS6VZ8PUSF08W8Y1A2';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


/**
 * Sets an item in the storage with the specified key and value.
 * @param {string} key - The key under which to store the value.
 * @param {string} value - The value to be stored.
 * @returns {Promise} - A Promise that resolves with the result of the operation.
 */
async function setItem(key, value) {
    const db = firebase.firestore();
    return db.collection('storage').doc(key).set({ value });
}
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
async function getItem(key) {
    const db = firebase.firestore();
    const doc = await db.collection('storage').doc(key).get();
    
    if (doc.exists) {
        return doc.data().value;
    } else {
        throw `Could not find data with key "${key}".`;
    }
}

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
