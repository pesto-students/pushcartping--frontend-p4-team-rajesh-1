import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';

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
const storage = firebase.storage();

// export { firebase, firebaseConfig, db, auth };

export const signInWithPhone = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        auth.signInWithPhoneNumber(phoneNumber)
            .then((CR) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                console.log('signed in thru phone');
                resolve({ confirmationResult: CR, codeStatus: 1, code: 1, msg: 'signed in thru phone' })
                // ...
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                reject({ msg: 'firebase.signInWithPhone error', code: -1 })
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
                reject({ code: -1, msg: 'firebase.verifyCode failed' })
            });
    });
}

export const checkIfCustomerInDatabase = ({ userID }) => {
    return new Promise((resolve, reject) => {
        db.collection(constants.db_customer_collection)
            .doc(userID)
            .get()
            .then(documentSnapshot => {
                // console.log(documentSnapshot);
                console.log('Customer exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    resolve({ code: 1, msg: 'Customer exists' })
                } else {
                    resolve({ code: 0, msg: 'Customer not found' })
                }
            })
            .catch((error) => {
                // User couldn't sign in (bad verification code?)
                // ...
                console.log('checkIfCustomerInDatabase error, uid:', userID)
                reject({ code: -1, msg: `checkIfCustomerInDatabase, uid: ${userID}` })
            });
    })
}

export const addPhotoToStorage = ({ userID, filePath }) => {
    return new Promise((resolve, reject) => {
        const fileName = 'profile_pic'
        const task = storage.ref(`/customers/${userID}/` + fileName).putFile(filePath);

        task.then(() => {
            console.log('Image uploaded to the bucket!');
            storage.ref(`/customers/${userID}/` + fileName)
                .getDownloadURL()
                .then((url) => {
                    //from url you can fetched the uploaded image easily
                    // this.setState({ profileImageUrl: url });
                    console.log('url')
                    resolve(url)
                })
                .catch((error) => {
                    console.log('getting downloadURL of image error => ', error)
                    reject()
                });
        }).catch((e) => {
            console.log('uploading image error => ', e);
            reject();
        });
    });
}

export const addCustomerToDatabase = ({ userID, userName = '', userEmail = '', userPhotoURL = '' }) => {
    return new Promise((resolve, reject) => {
        db.collection(constants.db_customer_collection)
            .doc(userID)
            .get()
            .then(documentSnapshot => {
                console.log(documentSnapshot);
                console.log('Customer exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    console.log('User data: ', documentSnapshot.data());
                    reject({ code: 0, msg: 'Customer already exists' })
                } else {
                    console.log('userPhotoURL', userPhotoURL)
                    db.collection(constants.db_customer_collection)
                        .doc(userID)
                        .set({
                            name: userName,
                            email: userEmail,
                            photoURL: userPhotoURL,
                        })
                        .then(() => {
                            console.log('Customer added!');
                            resolve({ code: 1, msg: 'Customer added' })
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
                console.log('addCustomerToDatabase error, uid:', userID)
                reject({ code: -1, msg: `addCustomerToDatabase error, uid: ${userID}` })
            });
    });
}

export const checkIfVendorInDatabase = ({ userID }) => {
    return new Promise((resolve, reject) => {
        db.collection(constants.db_vendor_collection)
            .doc(userID)
            .get()
            .then(documentSnapshot => {
                // console.log(documentSnapshot);
                console.log('Vendor exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    resolve({ code: 1, msg: 'Vendor exists' })
                } else {
                    resolve({ code: 0, msg: 'Vendor not found' })
                }
            })
            .catch((error) => {
                // User couldn't sign in (bad verification code?)
                // ...
                console.log('checkIfVendorInDatabase error, uid:', userID)
                reject({ code: -1, msg: `checkIfVendorInDatabase, uid: ${userID}` })
            });
    })
}

export const addVendorPhotosToStorage = ({ userID, filePaths }) => {
    let downloadURLS = []
    console.log('addVendorPhotosToStorage urls:', filePaths)

    const promises = filePaths.map((item, index) => {
        return new Promise((resolve, reject) => {
            const fileName = 'profile_pic_' + index;
            const task = storage.ref(`/vendors/${userID}/` + fileName).putFile(item);
            task.then(() => {
                console.log('Image uploaded to the bucket!');
                storage.ref(`/vendors/${userID}/` + fileName)
                    .getDownloadURL()
                    .then((url) => {
                        //from url you can fetched the uploaded image easily
                        // this.setState({ profileImageUrl: url });
                        console.log('url')
                        downloadURLS.push(url)
                        resolve()
                    })
                    .catch((error) => {
                        console.log('getting downloadURL of image error => ', error)
                        reject()
                    });
            }).catch((e) => {
                console.log('uploading image error => ', e);
                reject();
            });
        })
    })

    Promise.all(promises).then(
        () => console.log('addVendorPhotosToStorage() success')
    ).catch(
        () => console.log('addVendorPhotosToStorage() failure')
    )
}

export const addVendorToDatabase = ({ userID, userName = '', userEmail = '', userPhotoURL = '' }) => {
    return new Promise((resolve, reject) => {
        db.collection(constants.db_vendor_collection)
            .doc(userID)
            .get()
            .then(documentSnapshot => {
                console.log(documentSnapshot);
                console.log('Vendor exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    console.log('Vendor data: ', documentSnapshot.data());
                    reject({ code: 0, msg: 'Vendor already exists' })
                } else {
                    db.collection(constants.db_vendor_collection)
                        .doc(userID)
                        .set({
                            name: userName,
                            email: userEmail,
                            photoURL: userPhotoURL,
                        })
                        .then(() => {
                            console.log('Vendor added!');
                            resolve({ code: 1, msg: 'Vendor added' })
                        })
                        .catch((error) => {
                            // User couldn't sign in (bad verification code?)
                            // ...
                            console.log('couldnt insert new Vendor')
                            reject({ code: 0, msg: 'couldnt insert new Vendor' })
                        });
                }
            })
            .catch((error) => {
                console.log('addVendorToDatabase error, uid:', userID)
                reject({ code: -1, msg: `addVendorToDatabase error, uid: ${userID}` })
            });
    });
}
