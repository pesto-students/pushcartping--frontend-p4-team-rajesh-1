import React, { useState, useRef, useContext } from 'react';
import { View, StyleSheet, ImageBackground, Image, TextInput, Button, StatusBar } from 'react-native'
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { firebase, firebaseConfig, db, auth } from '../../firebase';

import constants from '../config/constants'
import { PCPLogo, PCPButton, PCPTextInput, UserSwitch, UserInput } from '../components';
import { UserContext } from '../context/UserContext';

const attemptInvisibleVerification = true

const WelcomeScreen = ({ navigation }) => {
    const { user, setUser, userType, setUserType } = useContext(UserContext);
    const [phoneNumber, setPhoneNumber] = useState(constants.defaultPhoneNumber);
    const [verificationCode, setVerificationCode] = useState(constants.defaultVerificationCode);
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);

    // Function to be called when requesting for a verification code
    const verifyPhoneNumber = async () => {
        console.log("Verify Phone: ", userType, 'phone:', phoneNumber)
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
            .then(setVerificationId);
    };

    // Function to be called when confirming the verification code that we received from Firebase via SMS
    const verifyCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            verificationCode
        );
        firebase
            .auth()
            .signInWithCredential(credential)
            .then((result) => {
                // Do something with the results here
                setVerificationCode(constants.defaultVerificationCode);
                console.log("RAW: USER RECEIVED");
                console.log(result);
                console.log("JSON: USER RECEIVED");
                console.log(JSON.stringify(result));
                setUser(result.user);

                if (result.additionalUserInfo.isNewUser) {
                    // show profile screen
                    console.log("show profile screen, userType:", userType)
                    if (userType === constants.userTypeCustomer) {
                        console.log('New Customer')
                    } if (userType === constants.userTypeVendor) {
                        console.log('New Vendor')
                    }
                } else {
                    navigation.navigate(constants.screenPushCartMap);
                }
            });
    }

    return (
        <View style={styles.container}>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
                attemptInvisibleVerification={attemptInvisibleVerification}
                androidHardwareAccelerationDisabled={true}
                androidLayerType="software"
            />

            <ImageBackground
                blurRadius={5}
                source={require('../assets/welcome.jpg')}
                resizeMode='cover'
                style={styles.background}>

                <View style={styles.logo}>
                    <PCPLogo />
                </View>

                <View style={styles.form}>
                    <UserSwitch />

                    <UserInput
                        placeholder='Phone Number'
                        defaultValue={constants.defaultPhoneNumber}
                        onChangeText={setPhoneNumber}
                        buttonTitle='Get Verification Code'
                        buttonColor={constants.colorButton}
                        onButtonPress={verifyPhoneNumber}
                        accessibilityLabel="Click here to submit phone number"
                    />

                    <UserInput
                        placeholder='Verification Code'
                        defaultValue={constants.defaultVerificationCode}
                        onChangeText={setVerificationCode}
                        buttonTitle='Submit'
                        buttonColor={constants.colorButton}
                        onButtonPress={verifyCode}
                        accessibilityLabel="Click here to submit phone number"
                    />
                </View>
            </ImageBackground>
            {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
        </View>
    )
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    logo: {
        top: StatusBar.currentHeight + 40,
    },
    form: {
        position: 'absolute',
        bottom: 20,
        width: '60%',
    },
    text: {
        position: 'relative',
        height: 40,
    },
    button: {
        position: 'relative',
        height: 40,
    }
})

