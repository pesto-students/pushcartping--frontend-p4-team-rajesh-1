import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import constants from './app/config/constants';

const firebaseConfig = {
    apiKey: "AIzaSyBQubaqE2aJuw8Sir8OxwaWaeKP9u6GYcA",
    authDomain: "pushcartping.firebaseapp.com",
    projectId: "pushcartping",
    databaseURL: "https://pushcartping.firebaseio.com",
    storageBucket: "pushcartping.appspot.com",
    messagingSenderId: "821602070633",
    appId: "1:821602070633:android:c0775063458410d68a72f8"
};

let app;
// console.log('firebase apps:', firebase.apps.length)
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}

const db = firebase.firestore();
const auth = firebase.auth();

export { firebase, firebaseConfig, db, auth };

export const signInWithPhone = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        auth.signInWithPhoneNumber(phoneNumber)
            .then((CR) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                console.log('signed in thru phone');
                resolve({ confirmationResult: CR, codeStatus: 1, responseCode: 1, msg: 'signed in thru phone' })
                // ...
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                reject({ msg: 'firebase.signInWithPhone error', responseCode: 0 })
            });
    });
};

export const verifySMSCode = (confirmationResult, verificationCode) => {
    return new Promise((resolve, reject) => {
        confirmationResult
            .confirm(verificationCode)
            .then((result) => {
                // User signed in successfully.
                console.log('Got user')
                console.log(JSON.stringify(result))
                resolve({ code: 1, msg: 'Got user', user: result.user })
            })
            .catch((error) => {
                // User couldn't sign in (bad verification code?)
                // ...
                console.log('wheres the user')
                reject({ code: 0, msg: 'firebase.verifyCode failed' })
            });
    });
}

export const checkIfUserInDatabase = ({ userID }) => {
    return new Promise((resolve, reject) => {
        db.collection(constants.db_user_collection)
            .doc(userID)
            .get()
            .then(documentSnapshot => {
                // console.log(documentSnapshot);
                console.log('User exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    resolve({ code: 1, msg: 'User exists' })
                } else {
                    reject({ code: 0, msg: 'User not found' })
                }
            })
            .catch((error) => {
                // User couldn't sign in (bad verification code?)
                // ...
                console.log('checkIfUserInDatabase error, uid:', userID)
                reject({ code: 0, msg: `checkIfUserInDatabase, uid: ${userID}` })
            });
    })
}

export const addUserToDatabase = ({ userID, userName, userEmail, userPhotoURL }) => {
    return new Promise((resolve, reject) => {
        db.collection(constants.db_user_collection)
            .doc(userID)
            .get()
            .then(documentSnapshot => {
                console.log(documentSnapshot);
                console.log('User exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    console.log('User data: ', documentSnapshot.data());
                    reject({ code: 0, msg: 'User already exists' })
                } else {
                    db.collection(constants.db_user_collection)
                        .doc(userID)
                        .set({
                            name: userName,
                            email: userEmail,
                            photoURL: userPhotoURL,
                        })
                        .then(() => {
                            console.log('User added!');
                            resolve({ code: 1, msg: 'User added' })
                        })
                        .catch((error) => {
                            // User couldn't sign in (bad verification code?)
                            // ...
                            console.log('couldnt insert new user')
                            reject({ code: 0, msg: 'couldnt insert new user' })
                        });
                }
            })
            .catch((error) => {
                console.log('addUserToDatabase error, uid:', userID)
                reject({ code: 0, msg: `addUserToDatabase error, uid: ${userID}` })
            });
    });
}
