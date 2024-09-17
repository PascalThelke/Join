// Importiere Firebase App und die benötigten Dienste
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyAg7nsqKUaXhg5-PIr3xIRhfhzxSm0bs3w",
  authDomain: "join-79db1.firebaseapp.com",
  projectId: "join-79db1",
  storageBucket: "join-79db1.appspot.com",
  messagingSenderId: "851577529567",
  appId: "1:851577529567:web:a35c6cb349c416c3eff56a"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportiere Firebase-Instanzen für andere Dateien
export { app, db };
