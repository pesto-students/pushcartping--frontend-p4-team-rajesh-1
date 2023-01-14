import { StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity } from 'react-native'
import React, { useContext, useCallback } from 'react'
import DocumentPicker from 'react-native-document-picker';

import { UserInput } from '../components'
import { UserContext } from '../context/UserContext'
import constants from '../config/constants'

const NewCustomerScreen = () => {
    const { user, setUser, userType, setUserType } = useContext(UserContext);

    const loadImage = useCallback(async () => {
        try {
            const response = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
            });
            setFileResponse(response);
            console.log("got file, res:", response)
        } catch (err) {
            console.warn(err);
        }
    }, []);

    return (
        <View style={styles.container}>

            <Text style={styles.heading}>Phone: {user.phoneNumber}</Text>

            <View style={styles.input}>
                <Text style={styles.inputLabel}>Enter Your Name:</Text>
                <TextInput style={styles.inputText} placeholder='Enter your full name' />
            </View>
            <View style={styles.input}>
                <Text style={styles.inputLabel}>Enter Your Email:</Text>
                <TextInput style={styles.inputText} placeholder='Enter your email id' />
            </View>
            <View style={styles.input}>
                <Text style={styles.inputLabel}>Add a photo</Text>
                <TouchableOpacity style={styles.button} onPress={loadImage}>
                    <Text style={styles.select}>Select 🖼</Text>
                </TouchableOpacity>
            </View>
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