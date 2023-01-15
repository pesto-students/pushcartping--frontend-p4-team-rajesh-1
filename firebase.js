import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBQubaqE2aJuw8Sir8OxwaWaeKP9u6GYcA",
    authDomain: "pushcartping.firebaseapp.com",
    projectId: "pushcartping",
    databaseURL: "https://pushcartping.firebaseio.com",
    storageBucket: "pushcartping.appspot.com",
    messagingSenderId: "821602070633",
    appId: "1:821602070633:web:26ec44894e98c8578a72f8"
};

let app;
console.log('firebase apps:', firebase.apps.length)
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}

const db = firebase.firestore();
const auth = firebase.auth();

export { firebase, firebaseConfig, db, auth };