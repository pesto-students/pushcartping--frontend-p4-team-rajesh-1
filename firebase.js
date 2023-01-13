import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import '@firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBQubaqE2aJuw8Sir8OxwaWaeKP9u6GYcA",
    authDomain: "pushcartping.firebaseapp.com",
    projectId: "pushcartping",
    storageBucket: "pushcartping.appspot.com",
    messagingSenderId: "821602070633",
    appId: "1:821602070633:web:26ec44894e98c8578a72f8"
};

let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { firebase, firebaseConfig, db, auth };