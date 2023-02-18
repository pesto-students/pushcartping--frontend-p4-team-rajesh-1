import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';

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
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}

const auth = firebase.auth();
const storage = firebase.storage();

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

export const addVendorPhotosToStorage = async ({ userID, filePaths = [] }) => {
    let downloadURLS = []
    // console.log('addVendorPhotosToStorage urls:', filePaths)

    const promises = filePaths.map((item, index) => {
        return new Promise((resolve, reject) => {
            const fileName = 'profile_pic_' + index;
            const task = storage.ref(`/vendors/${userID}/` + fileName).putFile(item);
            // console.log('fileName: ', fileName, 'item:', item)
            // console.log(task)
            task.then(() => {
                try {
                    console.log('Image uploaded to the bucket!');
                    storage.ref(`/vendors/${userID}/` + fileName)
                        .getDownloadURL()
                        .then((url) => {
                            //from url you can fetched the uploaded image easily
                            // this.setState({ profileImageUrl: url });
                            console.log('url:', url)
                            // downloadURLS.push(url)
                            resolve(url)
                        })
                        .catch((error) => {
                            // console.log('getting downloadURL of image error => ', error)
                            reject()
                        });
                } catch (error) {
                    // console.log('some error!')
                }
            }).catch((error) => {
                // console.log('uploading image error => ', error);
                reject();
            });
        })
    })

    return Promise.all(promises)
        .then((data) => {
            // console.log("GOT ALL URLS", data)
            return data
        })
        .catch((error) => console.log('addVendorPhotosToStorage() failure'))
}
