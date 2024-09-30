// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRhoPheaec9w61WFm-72VxxDIVZbxxHY8",
  authDomain: "mern-book-inventory-a9b87.firebaseapp.com",
  projectId: "mern-book-inventory-a9b87",
  storageBucket: "mern-book-inventory-a9b87.appspot.com",
  messagingSenderId: "114315419926",
  appId: "1:114315419926:web:b032d014308bad15967037"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;