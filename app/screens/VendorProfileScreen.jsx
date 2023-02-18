import { Dimensions, StyleSheet, Text, View, ImageBackground, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as Location from 'expo-location';
import constants from '../config/constants'
import { addUserEntry } from '../context/rootSlice';
import { axSetCurrentVendorLocation } from '../context/axiosAPI';


let width = Dimensions.get('window').width;

const VendorProfileScreen = () => {
    const userSlice = useSelector((state) => state.root.user)
    const dispatch = useDispatch()

    const timerIntervalInSeconds = 10
    useEffect(() => {
        const timer = setInterval(() => {
            console.log(`VendorProfileScreen: This will run after ${timerIntervalInSeconds} seconds!`)
            getLocation()
        }, timerIntervalInSeconds * 1000);
        return () => clearInterval(timer);
    }, []);

    let permission;
    const getLocation = async () => {
        console.log('trying to get locs')

        if (!permission) {
            permission = await Location.requestForegroundPermissionsAsync();

            if (permission.status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                console.log('trying to get locs error 1')
                return;
            }
        }

        // console.log('trying to get locs1')
        let loc = await Location.getCurrentPositionAsync({});
        // console.log('trying to get locs2')
        if (constants.userLocationLat && constants.userLocationLng) {
            dispatch(addUserEntry({ 'latitude': constants.userLocationLat, 'longitude': constants.userLocationLng }))
            await axSetCurrentVendorLocation({ uid: userSlice.uid, latitude: constants.userLocationLat, longitude: constants.userLocationLng })
        } else {
            dispatch(addUserEntry({ 'latitude': loc.coords.latitude, 'longitude': loc.coords.longitude }))
            await axSetCurrentVendorLocation({ uid: userSlice.uid, latitude: loc.coords.latitude, longitude: loc.coords.longitude })
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                // blurRadius={0}
                source={require('../assets/welcome.jpg')}
                resizeMode='cover'
                style={styles.background}>

                <Text style={[styles.textStyle, { fontWeight: 'bold', marginBottom: 20 }]}>Your Profile</Text>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>{userSlice.name}</Text>
                <Image
                    style={{ width: width * .6, aspectRatio: 1, resizeMode: 'contain', borderColor: 'white', borderWidth: 2, marginBottom: 10 }}
                    source={{ uri: userSlice.photoURL[0], }}
                />
                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>CATEGORY</Text>
                <Text style={[styles.textStyle, { fontWeight: 'normal', marginBottom: 10 }]}>{userSlice.category}</Text>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>DESCRIPTION</Text>
                <Text style={[styles.textStyle, { width: width * .6, numberOfLines: 5, textAlign: 'center', marginBottom: 10 }]}>{userSlice.description}</Text>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>TAGLINE</Text>
                <Text style={[styles.textStyle, { fontWeight: 'normal', marginBottom: 10 }]}>#{userSlice.tagline}</Text>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>PHONE</Text>
                <Text style={[styles.textStyle, { fontWeight: 'normal', marginBottom: 10 }]}>{userSlice.phone}</Text>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>EMAIL</Text>
                <Text style={[styles.textStyle, { fontWeight: 'normal', marginBottom: 10 }]}>{userSlice.email}</Text>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>LOCATION</Text>
                <Text style={[styles.textStyle, { fontWeight: 'normal' }]}>Lat: {userSlice.latitude}</Text>
                <Text style={[styles.textStyle, { fontWeight: 'normal' }]}>Lng: {userSlice.longitude}</Text>
            </ImageBackground>
        </View>
    )
}

export default VendorProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        // padding: 20,
    },
    background: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    textStyle: {
        color: 'white',
    }
})