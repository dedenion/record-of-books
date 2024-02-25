import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseCongfig = {
    apiKey: "AIzaSyB-WgXwxUad7DYe3MmE2lHbw9D_VgkrXLo",
    authDomain: "record-of-books.firebaseapp.com",
    projectId: "record-of-books",
    storageBucket: "record-of-books.appspot.com",
    messagingSenderId: "196278103060",
    appId: "1:196278103060:web:71eb96bd8e4904a8eb0b01",
    measurementId: "G-JCZ3PB7NRR"

};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth };
export default db;


