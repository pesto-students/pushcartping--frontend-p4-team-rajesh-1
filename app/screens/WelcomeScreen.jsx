import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Alert, Image, Platform, KeyboardAvoidingView, TouchableHighlight, ToastAndroid } from 'react-native'
import { FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';

import { signInWithPhone, verifySMSCode, checkIfCustomerInDatabase, checkIfVendorInDatabase, addCustomerToDatabase, addPhotoToStorage, addVendorToDatabase, addVendorPhotosToStorage } from '../../firebase';
import constants from '../config/constants'
import { UserSwitch, ButtonPCP, InputPCP, DropdownPCP } from '../components';
import { UserContext } from '../context/UserContext';

const attemptInvisibleVerification = true

const WelcomeScreen = ({ navigation }) => {
    const { user, setUser, userData, setUserData } = useContext(UserContext);

    const [inputValue, setInputValue] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState(constants.defaultPhoneNumber);
    const [verificationCode, setVerificationCode] = useState(constants.defaultVerificationCode);
    // const [userName, setUserName] = useState(constants.defaultUserName)
    // const [email, setEmail] = useState(constants.defaultUserEmail)
    const [filePath, setFilePath] = useState('');
    const [filePaths, setFilePaths] = useState([]);

    const [confirmationResult, setConfirmationResult] = useState(null);
    const [codeStatus, setCodeStatus] = useState(0);

    // const createAlert = (title, message) =>
    //     Alert.alert(title, message, [
    //         { text: 'OK', onPress: () => console.log('OK Pressed') },
    //     ]);

    const createAlert = (message) => {
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        );
    };

    // Function to be called when requesting for a verification code
    const verifyPhoneNumber = async () => {
        try {
            console.log("Verify Phone: ", userData.type, 'phone:', phoneNumber)

            if (!phoneNumber) {
                console.log('phone alert time')
                createAlert('Error:', 'Please enter valid phone number.')
                return;
            }

            await signInWithPhone(phoneNumber)
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
                setUserData(prevState => ({ ...prevState, phone: phoneNumber }))
                // isUserInDatabase();
                //goToNextScreen(response.isNewUser)
            })
            .catch((error) => {
                console.log('verifySMSCode error:', error)
            });
    }

    const isCustomerInDatabase = async () => {
        console.log('isCustomerInDatabase user id: ', user.uid)
        await checkIfCustomerInDatabase({ userID: user.uid })
            .then((response) => {
                console.log('isCustomerInDatabase response, ', response);
                goToNextScreen(response.code === 0 ? false : true)
            })
            .catch((error) => {
                console.log('isCustomerInDatabase error:', error);
            });
    }

    const isVendorInDatabase = async () => {
        console.log('isVendorInDatabase user id: ', user.uid)
        await checkIfVendorInDatabase({ userID: user.uid })
            .then((response) => {
                console.log('isVendorInDatabase response, ', response);
                goToNextScreen(response.code === 0 ? false : true)
            })
            .catch((error) => {
                console.log('isVendorInDatabase error:', error);
            });
    }

    const addCustomerToDB = async () => {
        console.log('addCustomerToDB user id: ', user.uid)

        if (!userData.name || userData.name.length === 0 || !userData.email || userData.email.length === 0) {
            createAlert('Error:', 'Name and email cannot be empty.')
            return;
        }

        let photoURL = ''
        await addPhotoToStorage({ userID: user.uid, filePath: filePath })
            .then((url) => {
                console.log('url', url)
                photoURL = url
                setUserData(prevState => ({ ...prevState, photoURL: photoURL }))
            })
            .catch((error) => {
                console.log('addCustomerToDB error:', error);
            });

        console.log('photoURL:', photoURL)

        await addCustomerToDatabase({ userID: user.uid, userName: userData.name, userEmail: userData.email, userPhotoURL: photoURL })
            .then((response) => {
                console.log('addCustomerToDB response, ', response);
                goToNextScreen(response.code === 0 ? false : true)
            })
            .catch((error) => {
                console.log('addCustomerToDB error:', error);
            });
    }

    const addVendorToDB = async () => {
        console.log('addVendorToDB user id:', user.uid)

        if (!userData.name || userData.name.length === 0 || !userData.email || userData.email.length === 0) {
            createAlert('Error:', 'Name and email cannot be empty.')
            return;
        }

        let photoURLs = ''
        await addVendorPhotosToStorage({ userID: user.uid, filePaths: filePaths })
            .then((urls) => {
                console.log('urls', urls)
                photoURLs = urls
                setUserData(prevState => ({ ...prevState, photoURLs: urls }))
            })
            .catch((error) => {
                console.log('addPhotoToStorage error:', error);
            });

        // console.log('photoURLs:', photoURLs)

        await addVendorToDatabase({
            userID: user.uid, userName: userData.name, userEmail: userData.email, userPhotoURLs: photoURLs,
            userCategory: userData.category, userTagline: userData.tagline, userDescription: userData.description
        }).then((response) => {
            console.log('addVendorToDatabase response, ', response);
            goToNextScreen(response.code === 0 ? false : true)
        }).catch((error) => {
            console.log('addVendorToDatabase error:', error);
        });
    }

    useEffect(() => {
        if (!user.uid) return
        console.log('useeffect called, uid: ', user.uid)
        // console.log(JSON.stringify(user))
        if (userData.type === 0)
            isCustomerInDatabase();
        else if (userData.type === 0)
            isVendorInDatabase();
    }, [user]);

    // useEffect(() => {
    //     console.log('checking userdata: ', userData)
    // }, [userData]);

    const goToNextScreen = (isExistingUser) => {
        console.log('goToNextScreen, isNewUser:', isExistingUser)

        // For TESTING ONLY
        // navigation.navigate(constants.screenNewCustomer);
        // return;

        if (!isExistingUser) {
            // show profile screen
            console.log("show profile screen, userType:", userData.type)
            if (userData.type === constants.userTypeCustomer) {
                console.log('New Customer')
                setInputValue(3);
                // navigation.navigate(constants.screenNewCustomer)
            } if (userData.type === constants.userTypeVendor) {
                console.log('New Vendor')
                setInputValue(4);
                // navigation.navigate(constants.screenNewVendor)
            }
        } else {
            navigation.navigate(constants.screenPushCartMap);
        }
    }

    const chooseFile = async (type) => {
        if (filePath)
            return

        let options = {
            mediaType: type,
            maxWidth: 300,
            maxHeight: 300,
            quality: 1,
        };

        const response = await launchImageLibrary(options);
        if (response.didCancel) {
            createAlert('User cancelled camera picker');
            return;
        } else if (response.errorCode == 'camera_unavailable') {
            createAlert('Camera not available on device');
            return;
        } else if (response.errorCode == 'permission') {
            createAlert('Permission not satisfied');
            return;
        } else if (response.errorCode == 'others') {
            createAlert(response.errorMessage);
            return;
        }
        console.log('response:', response.assets[0])
        setFilePath(response.assets[0].uri);

        // launchImageLibrary(options, (response) => {
        //     console.log('Response = ', response);

        //     if (response.didCancel) {
        //         alert('User cancelled camera picker');
        //         return;
        //     } else if (response.errorCode == 'camera_unavailable') {
        //         alert('Camera not available on device');
        //         return;
        //     } else if (response.errorCode == 'permission') {
        //         alert('Permission not satisfied');
        //         return;
        //     } else if (response.errorCode == 'others') {
        //         alert(response.errorMessage);
        //         return;
        //     }
        //     console.log('base64 -> ', response.assets[0].base64);
        //     console.log('uri -> ', response.assets[0].uri);
        //     console.log('width -> ', response.assets[0].width);
        //     console.log('height -> ', response.assets[0].height);
        //     console.log('fileSize -> ', response.assets[0].fileSize);
        //     console.log('type -> ', response.assets[0].type);
        //     console.log('fileName -> ', response.assets[0].fileName);
        //     setFilePath(response.assets[0].uri);
        // });
    };

    const chooseFiles = async (type) => {
        if (filePaths.length === 4) {
            createAlert('No more images allowed!')
            return
        }

        let options = {
            mediaType: type,
            maxWidth: 300,
            maxHeight: 300,
            quality: 1,
        };

        const response = await launchImageLibrary(options);
        console.log('chooseFiles response:')
        console.log(response)
        if (response.didCancel) {
            createAlert('User cancelled camera picker');
            return;
        } else if (response.errorCode == 'camera_unavailable') {
            createAlert('Camera not available on device');
            return;
        } else if (response.errorCode == 'permission') {
            createAlert('Permission not satisfied');
            return;
        } else if (response.errorCode == 'others') {
            createAlert(response.errorMessage);
            return;
        }
        setFilePaths(prevState => [...prevState, response.assets[0].uri])
    };

    const removePhotoAt = (index) => {
        setFilePaths([
            ...filePaths.slice(0, index),
            ...filePaths.slice(index + 1, filePaths.length)
        ]);
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
                                    height: 40,
                                    marginVertical: 5,
                                }}
                            />
                            <ButtonPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
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
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                title='GET OTP'
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
                                    height: 40,
                                }}
                                title='SIGN IN'
                                textColor={constants.colorWhite}
                                onPress={() => verifyCode()}
                            />
                        </>
                    }

                    {
                        inputValue == 3
                        &&
                        <>
                            <View>
                                <TouchableHighlight onPress={() => chooseFile('photo')}>
                                    <Image
                                        style={{ width: 50, height: 50 }}
                                        source={filePath ? { uri: filePath, } : require('../assets/input_icons/user.png')}
                                    />
                                </TouchableHighlight>
                                {filePath && <Icon style={{ position: 'absolute', right: -15, top: -15 }} name="close" size={20} color="#fff" onPress={() => setFilePath('')} />}
                            </View>

                            <InputPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                placeholder='YOUR FULL NAME'
                                keyboardType='default'
                                onChangeText={newText => setUserData(prevState => ({ ...prevState, name: newText }))}
                                icon={require('../assets/input_icons/user.png')}
                                iconStyle={{
                                    position: 'absolute',
                                    width: 20,
                                    height: 20,
                                    marginVertical: 10,
                                    marginLeft: 10,
                                }}
                            />

                            <InputPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                placeholder='YOUR EMAIL ADDRESS'
                                keyboardType='default'
                                default='email-address'
                                onChangeText={newText => setUserData(prevState => ({ ...prevState, email: newText }))}
                                icon={require('../assets/input_icons/email.png')}
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
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                title='REGISTER'
                                textColor={constants.colorWhite}
                                onPress={() => addCustomerToDB()}
                            />
                        </>
                    }

                    {
                        inputValue == 4
                        &&
                        <>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon style={{ marginRight: 10 }} name="plus" size={50} color="#fff" onPress={() => chooseFiles('photo')} />
                                {
                                    filePaths.map((item, index) =>
                                        <TouchableHighlight onPress={() => removePhotoAt(index)}>
                                            <Image
                                                style={{ width: 50, height: 50 }}
                                                source={{ uri: item, }}
                                            />
                                        </TouchableHighlight>
                                    )
                                }
                            </View>

                            <InputPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                placeholder='YOUR FULL NAME'
                                keyboardType='default'
                                onChangeText={newText => setUserData(prevState => ({ ...prevState, name: newText }))}
                                icon={require('../assets/input_icons/user.png')}
                                iconStyle={{
                                    position: 'absolute',
                                    width: 20,
                                    height: 20,
                                    marginVertical: 10,
                                    marginLeft: 10,
                                }}
                            />

                            <InputPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                placeholder='YOUR EMAIL ADDRESS'
                                keyboardType='default'
                                default='email-address'
                                onChangeText={newText => setUserData(prevState => ({ ...prevState, email: newText }))}
                                icon={require('../assets/input_icons/email.png')}
                                iconStyle={{
                                    position: 'absolute',
                                    width: 20,
                                    height: 20,
                                    marginVertical: 10,
                                    marginLeft: 10,
                                }}
                            />

                            <InputPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                placeholder='BUSINESS CATEGORY'
                                keyboardType='default'
                                onChangeText={newText => setUserData(prevState => ({ ...prevState, category: newText }))}
                                icon={require('../assets/input_icons/email.png')}
                                iconStyle={{
                                    position: 'absolute',
                                    width: 20,
                                    height: 20,
                                    marginVertical: 10,
                                    marginLeft: 10,
                                }}
                            />

                            <InputPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                placeholder='TAG LINE'
                                keyboardType='default'
                                onChangeText={newText => setUserData(prevState => ({ ...prevState, tagline: newText }))}
                                icon={require('../assets/input_icons/email.png')}
                                iconStyle={{
                                    position: 'absolute',
                                    width: 20,
                                    height: 20,
                                    marginVertical: 10,
                                    marginLeft: 10,
                                }}
                            />

                            <InputPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                placeholder='DESCRIPTION'
                                keyboardType='default'
                                onChangeText={newText => setUserData(prevState => ({ ...prevState, description: newText }))}
                                icon={require('../assets/input_icons/email.png')}
                                iconStyle={{
                                    position: 'absolute',
                                    width: 20,
                                    height: 20,
                                    marginVertical: 10,
                                    marginLeft: 10,
                                }}
                            />

                            {/* <DropdownPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                placeholder='BUSINESS CATEGORY'
                                keyboardType='default'
                                onChangeText={newText => setUserData(prevState => ({ ...prevState, category: newText }))}
                                icon={require('../assets/input_icons/email.png')}
                                iconStyle={{
                                    position: 'absolute',
                                    width: 20,
                                    height: 20,
                                    marginVertical: 10,
                                    marginLeft: 10,
                                }}

                                dropdownIcon={require('../assets/input_icons/user.png')}
                                dropdownStyle={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    width: 20,
                                    height: 20,
                                    marginVertical: 10,
                                    marginRight: 10,
                                }}
                                dropdownOnPress={true}
                            /> */}

                            <ButtonPCP
                                containerStyle={{
                                    width: '60%',
                                    height: 40,
                                    marginVertical: 5,
                                }}
                                title='REGISTER'
                                textColor={constants.colorWhite}
                                onPress={() => addVendorToDB()}
                            />
                        </>
                    }
                </View>
            </ImageBackground>
            {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
        </KeyboardAvoidingView >
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

