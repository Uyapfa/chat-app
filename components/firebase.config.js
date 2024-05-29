import { getApp,getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { filterConfig } from "react-native-gesture-handler";



const firebaseConfig = {
    apiKey: "AIzaSyCj389grP64gQBvjF6RvJ8gBAOUh1Ye1Es",
    authDomain: "first-chat-app-e1048.firebaseapp.com",
    projectId: "first-chat-app-e1048",
    storageBucket: "first-chat-app-e1048.appspot.com",
    messagingSenderId: "991988489055",
    appId: "1:991988489055:web:36e34c2ac5d81dd5ea34ea",
    measurementId: "G-SFJJZKSFYJ"
  };
  

  const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)

  const firebaseAuth = getAuth(app)
  const firestoreDB = getFirestore(app)

  export {app, firebaseAuth, firestoreDB}