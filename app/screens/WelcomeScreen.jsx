import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, ActivityIndicator, Image, Platform, KeyboardAvoidingView, TouchableHighlight, ToastAndroid } from 'react-native'
import { FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux'

import { signInWithPhone, verifySMSCode, checkIfCustomerInDatabase, checkIfVendorInDatabase, addCustomerToDatabase, addPhotoToStorage, addVendorToDatabase, addVendorPhotosToStorage } from '../../firebase';
import constants from '../config/constants'
import { UserSwitch, ButtonPCP, InputPCP, DropdownPCP } from '../components';
// import { UserContext } from '../context/UserContext';
import { addUserEntry } from '../context/rootSlice';

const attemptInvisibleVerification = true

const WelcomeScreen = ({ navigation }) => {
    const userSlice = useSelector((state) => state.root.user)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)

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
    const setUserType = (type) => {
        dispatch(addUserEntry({ 'type': type }))
        console.log('verify Phone:', userSlice)
        // console.log('hello hello:', rootSlice)
    }

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
            console.log('verify Phone:', userSlice)
            console.log("Verify Phone: ", userSlice.type, 'phone:', phoneNumber)

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
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log('signInWithPhone error:', error)
                    setIsLoading(false);
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
                dispatch(addUserEntry({ uid: response.user.uid }))
                dispatch(addUserEntry({ phone: phoneNumber }))

                console.log('USER ADDED:')
                console.log(userSlice.type)

                setIsLoading(false);
                if (userSlice.type === 0)
                    isCustomerInDatabase(response.user.uid);
                else if (userSlice.type === 1)
                    isVendorInDatabase(response.user.uid);
            })
            .catch((error) => {
                console.log('verifySMSCode error:', error)
            });
    }

    const isCustomerInDatabase = async (uid) => {
        setIsLoading(true);
        console.log('isCustomerInDatabase user id: ', uid)
        await checkIfCustomerInDatabase({ userID: uid })
            .then((response) => {
                console.log('isCustomerInDatabase response, ', response);
                for (let item in response.data) {
                    console.log(item, response.data[item])
                    // setUserData(prevState => ({ ...prevState, [item]: response.data[item] }))
                    dispatch(addUserEntry({ [item]: response.data[item] }))
                }
                goToNextScreen(response.code === 0 ? false : true)
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('isCustomerInDatabase error:', error);
                setIsLoading(false);
            });
    }

    const isVendorInDatabase = async (uid) => {
        setIsLoading(true);
        console.log('isVendorInDatabase user id: ', uid)
        await checkIfVendorInDatabase({ userID: uid })
            .then((response) => {
                console.log('isVendorInDatabase response, ', response);
                dispatch(addUserEntry(response.data))
                goToNextScreen(response.code === 0 ? false : true)
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('isVendorInDatabase error:', error);
                setIsLoading(false);
            });
    }

    const addCustomerToDB = async () => {
        console.log('addCustomerToDB user id: ', userSlice.uid)

        if (!userSlice.name || userSlice.name.length === 0 || !userSlice.email || userSlice.email.length === 0) {
            createAlert('Error:', 'Name and email cannot be empty.')
            return;
        }

        // setIsLoading(false);
        let photoURL = ''
        await addPhotoToStorage({ userID: userSlice.uid, filePath: filePath })
            .then((url) => {
                console.log('url', url)
                photoURL = url
                // setUserData(prevState => ({ ...prevState, photoURL: photoURL }))
                dispatch(addUserEntry({ photoURL: photoURL }))
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('addCustomerToDB error:', error);
                setIsLoading(false);
            });

        console.log('photoURL:', photoURL)

        setIsLoading(true);
        await addCustomerToDatabase({ userID: userSlice.uid, userName: userSlice.name, userEmail: userSlice.email, userPhotoURL: photoURL })
            .then((response) => {
                console.log('addCustomerToDB response, ', response);
                goToNextScreen(response.code === 0 ? false : true)
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('addCustomerToDB error:', error);
                setIsLoading(false);
            });
    }

    const addVendorToDB = async () => {
        console.log('addVendorToDB user id:', userSlice.uid)

        if (!userSlice.name || userSlice.name.length === 0 || !userSlice.email || userSlice.email.length === 0) {
            createAlert('Error:', 'Name and email cannot be empty.')
            return;
        }

        // setIsLoading(true);
        let photoURLs = ''
        await addVendorPhotosToStorage({ userID: userSlice.uid, filePaths: filePaths })
            .then((urls) => {
                console.log('urls', urls)
                photoURLs = urls
                // setUserData(prevState => ({ ...prevState, photoURLs: urls }))
                dispatch(addUserEntry({ photoURLs: urls }))
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('addPhotoToStorage error:', error);
                setIsLoading(false);
            });

        // console.log('photoURLs:', photoURLs)

        setIsLoading(true);
        await addVendorToDatabase({
            userID: storestoreuser.uid, userName: userSlice.name, userEmail: userSlice.email, userPhotoURLs: photoURLs,
            userCategory: userSlice.category, userTagline: userSlice.tagline, userDescription: userSlice.description
        }).then((response) => {
            console.log('addVendorToDatabase response, ', response);
            goToNextScreen(response.code === 0 ? false : true)
            setIsLoading(false);
        }).catch((error) => {
            console.log('addVendorToDatabase error:', error);
            setIsLoading(false);
        });
    }

    // useEffect(() => {
    //     if (!rootSlice.uid) return
    //     console.log('useeffect called, uid: ', rootSlice.uid)
    //     // console.log(JSON.stringify(user))
    //     if (rootSlice.type === 0)
    //         isCustomerInDatabase();
    //     else if (rootSlice.type === 1)
    //         isVendorInDatabase();
    // }, [rootSlice]);

    useEffect(() => {
        console.log('checking userSlice: ', userSlice)
        // if (userSlice.type === 0)
        //     isCustomerInDatabase();
        // else if (userSlice.type === 1)
        //     isVendorInDatabase();
    }, [userSlice]);

    const goToNextScreen = (isExistingUser) => {
        console.log('goToNextScreen, isNewUser:', isExistingUser)

        // For TESTING ONLY
        // navigation.navigate(constants.screenNewCustomer);
        // return;

        if (!isExistingUser) {
            // show profile screen
            console.log("show profile screen, userType:", userSlice.type)
            if (userSlice.type === constants.userTypeCustomer) {
                console.log('New Customer')
                setInputValue(3);
                // navigation.navigate(constants.screenNewCustomer)
            } else if (userSlice.type === constants.userTypeVendor) {
                console.log('New Vendor')
                setInputValue(4);
                // navigation.navigate(constants.screenNewVendor)
            }
        } else {
            if (userSlice.type === constants.userTypeCustomer) {
                console.log('Old Customer')
                navigation.navigate(constants.screenPushCartMap);
            } else if (userSlice.type === constants.userTypeVendor) {
                console.log('Old Vendor:', userSlice)
                navigation.navigate(constants.screenVendorProfile);
            }
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

                <Image
                    source={require('../assets/title.png')}
                    style={styles.img}
                    resizeMode='cover'
                />

                {
                    isLoading
                        ?
                        <ActivityIndicator size="large" color="#00ff00" style={styles.spinner} />
                        :

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
                                        callback={setUserType}
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
                                    // onPress={() => dispatch(addUserEntry({ 'name': 'mihir' }))}
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
                                        onPress={() => { setIsLoading(true); verifyPhoneNumber() }}
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
                                        onPress={() => { setIsLoading(true); verifyCode() }}
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
                                        onChangeText={newText => dispatch(addUserEntry({ name: newText }))}
                                        // onChangeText={newText => setUserData(prevState => ({ ...prevState, name: newText }))}
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
                                        onChangeText={newText => dispatch(addUserEntry({ email: newText }))}
                                        // onChangeText={newText => setUserData(prevState => ({ ...prevState, email: newText }))}
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
                                        onPress={() => { setIsLoading(true); addCustomerToDB() }}
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
                                        onChangeText={newText => dispatch(addUserEntry({ name: newText }))}
                                        // onChangeText={newText => setUserData(prevState => ({ ...prevState, name: newText }))}
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
                                        onChangeText={newText => dispatch(addUserEntry({ email: newText }))}
                                        // onChangeText={newText => setUserData(prevState => ({ ...prevState, email: newText }))}
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
                                        onChangeText={newText => dispatch(addUserEntry({ category: newText }))}
                                        // onChangeText={newText => setUserData(prevState => ({ ...prevState, category: newText }))}
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
                                        onChangeText={newText => dispatch(addUserEntry({ tagline: newText }))}
                                        // onChangeText={newText => setUserData(prevState => ({ ...prevState, tagline: newText }))}
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
                                        onChangeText={newText => dispatch(addUserEntry({ description: newText }))}
                                        // onChangeText={newText => setUserData(prevState => ({ ...prevState, description: newText }))}
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
                                        onPress={() => { setIsLoading(true); addVendorToDB() }}
                                    />
                                </>
                            }
                        </View>
                }
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
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

