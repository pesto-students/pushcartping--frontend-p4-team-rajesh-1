import React, { useState, useRef, useContext } from 'react';
import { View, StyleSheet, ImageBackground, Image, TextInput, Button } from 'react-native'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebase, firebaseConfig, db } from '../../firebase';

import constants from '../config/constants'
import { PCPLogo, PCPButton, PCPTextInput } from '../components';
import { UserContext } from '../context/UserContext';

const WelcomeScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const [phoneNumber, setPhoneNumber] = useState(constants.defaultPhoneNumber);
    const [verificationCode, setVerificationCode] = useState(constants.defaultVerificationCode);
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);

    // Function to be called when requesting for a verification code
    const verifyPhoneNumber = () => {
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
                    console.log("show profile screen")
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
                attemptInvisibleVerification={false}
            />
            <ImageBackground
                blurRadius={5}
                source={require('../assets/welcome.jpg')}
                resizeMode='cover'
                style={styles.background}>

                <PCPLogo />
                <TextInput
                    placeholder="Phone Number"
                    defaultValue={constants.defaultPhoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    autoCompleteType="tel"
                    textAlign={'center'}
                />

                <Button
                    onPress={verifyPhoneNumber}
                    title="Get Verification Code"
                    color="#841584"
                    accessibilityLabel="Click here to submit phone number"
                />

                <TextInput
                    placeholder="Verification Code"
                    defaultValue={constants.defaultVerificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    textAlign={'center'}
                />

                <Button
                    onPress={verifyCode}
                    title="Submit"
                    color="#841584"
                    accessibilityLabel="Click here to submit phone number"
                />

                {/* <PCPTextInput bgcolor={colors.primary} setPhoneNumber={setPhoneNumber} />
                <PCPButton text='Login' bgcolor={colors.primary} />
                <PCPButton text='Register' bgcolor={colors.secondary} /> */}
            </ImageBackground>
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
})

