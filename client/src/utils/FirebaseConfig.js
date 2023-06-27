import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyB9HbnPZlGN7QueLr843lW6BMwihEL44_o",
    authDomain: "whatsapp-clone-68ec6.firebaseapp.com",
    projectId: "whatsapp-clone-68ec6",
    storageBucket: "whatsapp-clone-68ec6.appspot.com",
    messagingSenderId: "833406183814",
    appId: "1:833406183814:web:6c6fcae6ace5d57a212407",
    measurementId: "G-1XH9DSVHDF"
  };
  

  const app = initializeApp(firebaseConfig)

  export const firebaseAuth = getAuth(app)