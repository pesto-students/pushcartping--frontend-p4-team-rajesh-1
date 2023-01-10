import * as firebase from 'firebase';
import '@firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyBQubaqE2aJuw8Sir8OxwaWaeKP9u6GYcA",
    authDomain: "pushcartping.firebaseapp.com",
    projectId: "pushcartping",
    storageBucket: "pushcartping.appspot.com",
    messagingSenderId: "821602070633",
    appId: "1:821602070633:web:26ec44894e98c8578a72f8"
};
firebase.initializeApp(firebaseConfig);
export default firebase;