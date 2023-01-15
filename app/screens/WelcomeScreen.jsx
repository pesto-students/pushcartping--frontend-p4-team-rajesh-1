import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, TextInput, Button, StatusBar } from 'react-native'
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { signInWithPhone, verifySMSCode } from '../../firebase';

import constants from '../config/constants'
import { PCPLogo, PCPButton, PCPTextInput, UserSwitch, UserInput } from '../components';
import { UserContext } from '../context/UserContext';

const attemptInvisibleVerification = true

const WelcomeScreen = ({ navigation }) => {
    const { user, setUser, userData, setUserData } = useContext(UserContext);
    const [phoneNumber, setPhoneNumber] = useState(constants.defaultPhoneNumber);
    const [verificationCode, setVerificationCode] = useState(constants.defaultVerificationCode);
    const [verificationId, setVerificationId] = useState(null);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [codeStatus, setCodeStatus] = useState(0);
    const recaptchaVerifier = useRef(null);

    // Function to be called when requesting for a verification code
    const verifyPhoneNumber = async () => {
        console.log("Verify Phone: ", userData.type, 'phone:', phoneNumber)
        signInWithPhone(phoneNumber)
            .then((response) => {
                console.log('signInWithPhone response:', Object.keys(response))
                setConfirmationResult(response.confirmationResult);
                setCodeStatus(response.codeStatus);
            })
            .catch((error) => {
                console.log('signInWithPhone error:', error)
            });
    };

    const verifyCode = async () => {
        verifySMSCode(confirmationResult, verificationCode)
            .then((response) => {
                console.log('verifySMSCode response:', Object.keys(response))
                setUser(response.user);
                goToNextScreen(response.isNewUser)
            })
            .catch((error) => {
                console.log('verifySMSCode error:', error)
            });
    }

    const goToNextScreen = (isNewUser) => {
        // For TESTING ONLY
        // navigation.navigate(constants.screenNewCustomer);
        // return;

        if (isNewUser) {
            // show profile screen
            console.log("show profile screen, userType:", userData.type)
            if (userData.type === constants.userTypeCustomer) {
                console.log('New Customer')
                navigation.navigate(constants.screenNewCustomer)
            } if (userData.type === constants.userTypeVendor) {
                console.log('New Vendor')
                navigation.navigate(constants.screenNewVendor)
            }
        } else {
            navigation.navigate(constants.screenPushCartMap);
        }
    }

    // const newVerifyCode = () => {
    //     confirmationResult
    //         .confirm(verificationCode)
    //         .then((result) => {
    //             // User signed in successfully.
    //             console.log('Got user', JSON.stringify(user))
    //             setUser(result.user);

    //             // For TESTING ONLY
    //             navigation.navigate(constants.screenNewCustomer);
    //             return;

    //             if (result.additionalUserInfo.isNewUser) {
    //                 // show profile screen
    //                 console.log("show profile screen, userType:", userData.type)
    //                 if (userData.type === constants.userTypeCustomer) {
    //                     console.log('New Customer')
    //                     navigation.navigate(constants.screenNewCustomer)
    //                 } if (userData.type === constants.userTypeVendor) {
    //                     console.log('New Vendor')
    //                     navigation.navigate(constants.screenNewVendor)
    //                 }
    //             } else {
    //                 navigation.navigate(constants.screenPushCartMap);
    //             }
    //             // ...
    //         })
    //         .catch((error) => {
    //             // User couldn't sign in (bad verification code?)
    //             // ...
    //             console.log('wheres the user')
    //         });
    // }

    return (
        <View style={styles.container}>
            {/* <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
                attemptInvisibleVerification={attemptInvisibleVerification}
                androidHardwareAccelerationDisabled={true}
                androidLayerType="software"
            /> */}

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
                        buttonDisabled={codeStatus == 0 ? false : true}
                        accessibilityLabel="Click here to submit phone number"
                    />

                    <UserInput
                        placeholder='Verification Code'
                        defaultValue={constants.defaultVerificationCode}
                        onChangeText={setVerificationCode}
                        buttonTitle='Submit'
                        buttonColor={constants.colorButton}
                        onButtonPress={verifyCode}
                        buttonDisabled={codeStatus == 0 ? true : false}
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

