import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// import { async } from "@firebase/util";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5Z8Wj47It66IYH7EcP-tbD0N3dO_uzRw",
  authDomain: "wordle-64eba.firebaseapp.com",
  projectId: "wordle-64eba",
  storageBucket: "wordle-64eba.appspot.com",
  messagingSenderId: "303912823998",
  appId: "1:303912823998:web:1438ac25f442210dbc82ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs };
