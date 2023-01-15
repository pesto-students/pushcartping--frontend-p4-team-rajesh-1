import { StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity, Button } from 'react-native'
import React, { useContext, useCallback, useState, useEffect } from 'react'
import { addUserToDatabase, db } from '../../firebase';
// import firestore from '@react-native-firebase/firestore';
import DocumentPicker, { types } from 'react-native-document-picker';

import { UserInput } from '../components'
import { UserContext } from '../context/UserContext'
import constants from '../config/constants'

const DEFAULT_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/pushcartping.appspot.com/o/fordemo%2Fcustomer.png?alt=media&token=ca1e014f-26c8-435b-81fc-ab1bf444ad08';

const NewCustomerScreen = () => {
    const [name, setName] = useState('dummy');
    const [email, setEmail] = useState('dummy@pcp.com');
    const [image, setImage] = useState(DEFAULT_IMAGE);
    const { user, setUser, userData, setUserData } = useContext(UserContext);

    const uploadImage = useCallback(async () => {
        try {
            const response = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                type: [types.images],
            });
            console.log("got file, res:", response)
            // setFileResponse(response);
        } catch (err) {
            console.warn(err);
        }
    }, []);

    const handleSubmit = async () => {
        console.log('name', name);
        console.log('email', email);
        console.log('image', image);

        if (!name && !email)
            return;

        addUserToDatabase({ userID: user.uid, userName: name, userEmail: email, userPhotoURL: image })
            .then((response) => {
                console.log('promise response:', Object.entries(response))
            })
            .catch((error) => {
                console.log('promise error:', error)
            });
    }

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
        // top: StatusBar.currentHeight,
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