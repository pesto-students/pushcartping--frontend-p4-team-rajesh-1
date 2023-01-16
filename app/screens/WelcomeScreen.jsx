import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity } from 'react-native'
import { FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { signInWithPhone, verifySMSCode } from '../../firebase';

import constants from '../config/constants'
import { PCPLogo, UserSwitch, ButtonPCP, InputPCP } from '../components';
import { UserContext } from '../context/UserContext';

const attemptInvisibleVerification = true

const WelcomeScreen = ({ navigation }) => {
    const { user, setUser, userData, setUserData } = useContext(UserContext);

    const [inputValue, setInputValue] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState(constants.defaultPhoneNumber);
    const [verificationCode, setVerificationCode] = useState(constants.defaultVerificationCode);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [codeStatus, setCodeStatus] = useState(0);


    // Function to be called when requesting for a verification code
    const verifyPhoneNumber = async () => {
        try {
            console.log("Verify Phone: ", userData.type, 'phone:', phoneNumber)
            signInWithPhone(phoneNumber)
                .then((response) => {
                    console.log('signInWithPhone response:', Object.keys(response))
                    setConfirmationResult(response.confirmationResult);
                    setCodeStatus(response.codeStatus);
                    setInputValue(2);
                })
                .catch((error) => {
                    console.log('signInWithPhone error:', error)
                });
        } catch (error) {
            console.log('Error in verify phone:', error)
        }
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

    return (
        <View style={styles.container}>
            <ImageBackground
                blurRadius={5}
                source={require('../assets/welcome.jpg')}
                resizeMode='cover'
                style={styles.background}>

                <View style={styles.logo}>
                    <PCPLogo />
                </View>

                <View style={styles.form}>
                    {
                        inputValue == 0
                        &&
                        <>
                            <Text style={styles.textdesc}>Choose your profile</Text>
                            <UserSwitch />
                            <ButtonPCP
                                title='Next'
                                color={constants.colorButton}
                                textColor={constants.colorWhite}
                                onPress={() => setInputValue(1)}
                            />

                            {/* <TouchableOpacity style={styles.button} onPress={() => setInputValue(1)}>
                                <Text style={styles.textbutton}>Next</Text>
                            </TouchableOpacity> */}
                        </>
                    }

                    {
                        inputValue == 1
                        &&
                        <>
                            <Text style={styles.textdesc}>Enter phone number</Text>
                            <InputPCP
                                placeholder='+91'
                                defaultValue={constants.defaultPhoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                            <ButtonPCP
                                title='Get Verification Code'
                                color={constants.colorButton}
                                textColor={constants.colorWhite}
                                onPress={() => verifyPhoneNumber()}
                            />
                        </>
                    }

                    {
                        inputValue == 2
                        &&
                        <>
                            <Text style={styles.textdesc}>Enter verification code</Text>
                            <InputPCP
                                placeholder='Verification Code'
                                defaultValue={constants.defaultVerificationCode}
                                onChangeText={setPhoneNumber}
                            />
                            <ButtonPCP
                                title='Sign In'
                                color={constants.colorButton}
                                textColor={constants.colorWhite}
                                onPress={() => verifyCode()}
                            />
                        </>
                    }
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
        flex: 1,
        top: 40,
    },
    form: {
        // flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    textdesc: {
        alignSelf: 'center',
        fontSize: 20,
    },
    button: {
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: constants.colorButton,
    },
    textbutton: {
        color: constants.colorWhite,
    }
})

