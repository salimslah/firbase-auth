


import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {getAuth} from 'firebase/auth'





const firebaseConfig = {
    apiKey: "AIzaSyD9Zku6GNlP5ciJ_QBNbnZ35j-U6qOqUjs",
    authDomain: "nextjs-project-c569a.firebaseapp.com",
    projectId: "nextjs-project-c569a",
    storageBucket: "nextjs-project-c569a.appspot.com",
    messagingSenderId: "153860734382",
    appId: "1:153860734382:web:fdce0658e1be5c1ca51c3f"
  };


// const app = initializeApp(firebaseConfig);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };





const auth = getAuth(app)

export {app, auth}













