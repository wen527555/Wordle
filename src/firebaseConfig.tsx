import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// import { async } from "@firebase/util";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkg5MKWWgwfGRquksAWcsOmyrGoxonHyI",
  authDomain: "wordle-c9246.firebaseapp.com",
  projectId: "wordle-c9246",
  storageBucket: "wordle-c9246.appspot.com",
  messagingSenderId: "421691797127",
  appId: "1:421691797127:web:c9786a370da0736c545222",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs };
