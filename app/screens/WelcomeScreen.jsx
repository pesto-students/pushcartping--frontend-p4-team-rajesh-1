import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Alert, Image, Platform, KeyboardAvoidingView } from 'react-native'
import { FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { LinearGradient } from "expo-linear-gradient";
import { signInWithPhone, verifySMSCode, checkIfUserInDatabase } from '../../firebase';

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

    const createAlert = (title, message) =>
        Alert.alert(title, message, [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);

    // Function to be called when requesting for a verification code
    const verifyPhoneNumber = async () => {
        try {
            console.log("Verify Phone: ", userData.type, 'phone:', phoneNumber)

            if (!phoneNumber || phoneNumber.length != 10) {
                console.log('phone alert time')
                createAlert('Error:', 'Please enter valid phone number.')
                return;
            }

            await signInWithPhone('+91' + phoneNumber)
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
        await verifySMSCode(confirmationResult, verificationCode)
            .then((response) => {
                console.log('verifySMSCode response:', Object.keys(response))
                console.log(Object.keys(response.user))
                console.log(JSON.stringify(response.user))
                setUser(response.user);
                // isUserInDatabase();
                //goToNextScreen(response.isNewUser)
            })
            .catch((error) => {
                console.log('verifySMSCode error:', error)
            });
    }

    const isUserInDatabase = async () => {
        console.log('isUserInDatabase user id: ', user.uid)
        await checkIfUserInDatabase({ userID: user.uid })
            .then((response) => {
                console.log('isUserInDatabase response, ', response);
                goToNextScreen(response.code ? false : true)
            })
            .catch((error) => {
                console.log('isUserInDatabase error:', error);
            });
    }

    useEffect(() => {
        console.log('useeffect called, uid: ', user.uid)
        console.log(JSON.stringify(user))
        isUserInDatabase();
    }, [user]);

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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ImageBackground
                // blurRadius={0}
                source={require('../assets/welcome.jpg')}
                resizeMode='cover'
                style={styles.background}>

                {/* <View style={styles.logo}> */}
                {/* <PCPLogo /> */}
                {/* <Image source={require('../assets/title.png')} style={styles.img} /> */}
                {/* </View> */}

                <Image
                    source={require('../assets/title.png')}
                    style={styles.img}
                    resizeMode='cover'
                />

                <View style={styles.form}>
                    {
                        inputValue == 0
                        &&
                        <>
                            <UserSwitch
                                containerStyle={{
                                    width: '60%',
                                    marginVertical: 5,
                                }}
                            />
                            <ButtonPCP
                                containerStyle={{
                                    width: '60%',
                                    marginVertical: 5,
                                }}
                                title='Next'
                                color={constants.colorButton}
                                textColor={constants.colorWhite}
                                onPress={() => setInputValue(1)}
                            />
                        </>
                    }

                    {
                        inputValue == 1
                        &&
                        <>
                            <InputPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                placeholder='ENTER PHONE NUMBER'
                                defaultValue={constants.defaultPhoneNumber}
                                onChangeText={setPhoneNumber}
                                icon={require('../assets/input_icons/phone.png')}
                                iconStyle={{
                                    position: 'absolute',
                                    width: 20,
                                    height: 20,
                                    marginVertical: 10,
                                    marginLeft: 10,
                                }}
                            />
                            <ButtonPCP
                                containerStyle={{
                                    width: '60%',
                                    marginVertical: 5,
                                }}
                                title='Get OTP'
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
                            <InputPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                placeholder='ENTER OTP'
                                defaultValue={constants.defaultVerificationCode}
                                onChangeText={setVerificationCode}
                                icon={require('../assets/input_icons/message.png')}
                                iconStyle={{
                                    position: 'absolute',
                                    width: 20,
                                    height: 20,
                                    marginVertical: 10,
                                    marginLeft: 10,
                                }}
                            />
                            <ButtonPCP
                                containerStyle={{
                                    width: '60%',
                                    marginVertical: 5,
                                }}
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
        </KeyboardAvoidingView>
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
    img: {
        // flex: 5,
        top: 60,
        transform: [{ scale: 0.4 }],
        // width: 1,
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
        color: constants.colorWhite,
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

