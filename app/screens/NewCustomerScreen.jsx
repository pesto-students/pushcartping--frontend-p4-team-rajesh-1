import { StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity, Button } from 'react-native'
import React, { useContext, useCallback, useState } from 'react'
import { db } from '../../firebase';
// import firestore from '@react-native-firebase/firestore';
// import DocumentPicker from 'react-native-document-picker';

import { UserInput } from '../components'
import { UserContext } from '../context/UserContext'
import constants from '../config/constants'

const NewCustomerScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { user, setUser, userData, setUserData } = useContext(UserContext);

    const imageURL = 'https://firebasestorage.googleapis.com/v0/b/pushcartping.appspot.com/o/fordemo%2Fcustomer.png?alt=media&token=ca1e014f-26c8-435b-81fc-ab1bf444ad08';

    const uploadImage = useCallback(async () => {
        // try {
        //     const response = await DocumentPicker.pickSingle({
        //         presentationStyle: 'fullScreen',
        //     });
        //     setFileResponse(response);
        //     console.log("got file, res:", response)
        // } catch (err) {
        //     console.warn(err);
        // }
    }, []);

    const handleSubmit = async () => {
        console.log('name', name);
        console.log('email', email);
        console.log('image', imageURL);

        if (!name && !email)
            return;

        try {
            const users = await firestore().collection('DummyUsers').get();
            console.log("reading db:", user);
        } catch (err) {
            console.log("nopes:", err)
        }

        // var docRef = db.collection("dummyUsers").doc(user.uid);
        // let userExists = false;
        // docRef.get().then((doc) => {
        //     if (doc.exists) {
        //         console.log("Document data:", doc.data());
        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such document!");
        //     }
        //     userExists = doc.exists;
        // }).catch((error) => {
        //     console.log("Error getting document:", error);
        // });

        // if (!userExists) {
        //     setDoc(doc(db, "dummyUsers", user.uid), {
        //         name: name,
        //         email: email,
        //         image: imageURL
        //     });
        // }
    }

    // useEffect(() => {
    //     var docRef = db.collection("dummyUsers").doc("user1");

    //     docRef.get().then((doc) => {
    //         if (doc.exists) {
    //             console.log("Document data:", doc.data());
    //         } else {
    //             // doc.data() will be undefined in this case
    //             console.log("No such document!");
    //         }
    //     }).catch((error) => {
    //         console.log("Error getting document:", error);
    //     });
    // }, []);

    return (
        <View style={styles.container}>

            <Text style={styles.heading}>Phone: {user.phoneNumber}</Text>

            <View style={styles.input}>
                <Text style={styles.inputLabel}>Enter Your Name:</Text>
                <TextInput
                    style={styles.inputText}
                    placeholder='Enter your full name'
                    value={name}
                    onChangeText={text => setName(text)}
                />
            </View>
            <View style={styles.input}>
                <Text style={styles.inputLabel}>Enter Your Email:</Text>
                <TextInput
                    style={styles.inputText}
                    placeholder='Enter your email id'
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
            </View>
            <View style={styles.input}>
                <Text style={styles.inputLabel}>Add a photo</Text>
                <TouchableOpacity style={styles.button} onPress={uploadImage}>
                    <Text style={styles.select}>Select 🖼</Text>
                </TouchableOpacity>
            </View>
            <Button title='Submit' onPress={handleSubmit}></Button>
        </View>
    )
}

export default NewCustomerScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        top: StatusBar.currentHeight,
        alignItems: 'flex-start',
        marginLeft: 20,
    },
    heading: {
        alignSelf: 'center',
        marginTop: 20,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    inputLabel: {
        flex: 1,
    },
    inputText: {
        flex: 2,
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    button: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    select: {
        backgroundColor: constants.colorButton,
        color: constants.colorWhite,
        fontSize: 16,
        alignSelf: 'flex-start',
        // marginHorizontal: 10,
        paddingHorizontal: 10,
    },
})