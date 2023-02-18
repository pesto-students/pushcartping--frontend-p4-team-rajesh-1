import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useContext, useEffect, useRef } from 'react'
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as Location from 'expo-location';

import constants from '../config/constants'
import { PushCartContext } from '../context/PushCartContext';
import { useDispatch } from 'react-redux'
import { addUserEntry } from '../context/rootSlice';

const MapDisplay = ({ scrollToItem }) => {
    // const { user, setUser, userData, setUserData } = useContext(UserContext);
    const dispatch = useDispatch()

    const [location, setLocation] = useState(null);
    const { pushCartList, setPushCartList } = useContext(PushCartContext);
    const ref = useRef();

    const clearSearch = () => {
        ref.current?.clear();
        ref.current?.setAddressText('');
    }

    const setNewAddress = (data, details) => {
        // console.log('DATA');
        console.log(JSON.stringify(data));
        // console.log('DETAILS');
        console.log(JSON.stringify(details));

        let region = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004,
        }

        setLocation(region);
    }

    const timerIntervalInSeconds = 10
    useEffect(() => {
        const timer = setInterval(() => {
            console.log(`This will run after ${timerIntervalInSeconds} seconds!`)
            getLocation()
        }, timerIntervalInSeconds * 1000);
        return () => clearInterval(timer);
    }, []);

    // useEffect(() => {
    //     console.log("HELLO PUSHCARTS")
    //     console.log(pushCartList)

    //     Object.keys(pushCartList).map(
    //         (item, index) => {
    //             console.log('item:', item, 'index:', index)
    //             console.log(pushCartList[item].name)
    //             console.log(pushCartList[item].latitude)
    //             console.log(pushCartList[item].longitude)
    //         })

    //     return () => {

    //     }
    // }, [pushCartList])


    // const drawPushCarts = () => {
    //     console.log(pushCartList)
    // }

    let permission;
    const getLocation = async () => {
        // console.log('trying to get locs')

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
            // setUserData(prevState => ({ ...prevState, loc: { 'lat': constants.userLocationLat, 'lng': constants.userLocationLng } }))
            dispatch(addUserEntry({ 'latitude': constants.userLocationLat, 'longitude': constants.userLocationLng }))
            setLocation({
                latitude: constants.userLocationLat,
                longitude: constants.userLocationLng,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004,
            })
        } else {
            // console.log('LOCATION:');
            console.log(JSON.stringify(loc));

            // setUserData(prevState => ({ ...prevState, loc: { 'lat': loc.coords.latitude, 'lng': loc.coords.longitude } }))
            dispatch(addUserEntry({ 'latitude': loc.coords.latitude, 'longitude': loc.coords.longitude }))
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004,
            })
        }
    }

    return (
        <>
            {
                location
                    ?
                    <View style={styles.container}>
                        <MapView
                            style={styles.map}
                            provider={MapView.PROVIDER_GOOGLE}
                            region={location}
                            showsUserLocation={true}
                            mapPadding={{ top: 40 }}
                        >
                            {
                                Object.keys(pushCartList).map(
                                    (item, index) =>
                                        <Marker
                                            coordinate={{ latitude: pushCartList[item].latitude, longitude: pushCartList[item].longitude }}
                                            title={pushCartList[item].name}
                                            // pinColor={constants.mapPinColorList[item.id]}
                                            // pinColor={'purple'}
                                            key={index}
                                            onPress={(e) => {
                                                console.log('marker onPress:', index)
                                                scrollToItem(index);
                                            }}
                                        />
                                )
                            }
                        </MapView>
                        <GooglePlacesAutocomplete
                            ref={ref}
                            placeholder='Search location'
                            fetchDetails={true}
                            onPress={(data, details = null) => setNewAddress(data, details)}
                            onFail={error => console.log(error)}
                            onNotFound={() => console.log('no results')}
                            query={{
                                key: process.env.GOOGLE_MAPS_API_KEY.toString(),
                                language: 'en',
                            }}
                            styles={styles.searchBar}
                            // renderLeftButton={() => <FontAwesome5 name="map-marker-alt" size={20} color="black" style={styles.searchButton} />}
                            renderRightButton={() =>
                                <TouchableOpacity
                                    onPress={() => {
                                        clearSearch();
                                    }}>
                                    <Ionicons name="close" size={30} color="black" style={styles.clearButton} />
                                </TouchableOpacity>
                            }
                        />
                    </View>
                    :
                    <ActivityIndicator size="large" color="#00ff00" style={styles.container} />
            }
        </>
    )
}

export default MapDisplay

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        widht: '100%',
        height: '100%',
        backgroundColor: 'grey',
    },
    map: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    searchBar: {
        container: {
            width: '100%',
        },
        textInput: {
            backgroundColor: constants.mapSearchBarColor,
            width: '100%',
            height: 35,
            color: '#0',
            margin: 10,
        },
    },
    searchButton: {
        marginVertical: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButton: {
        marginVertical: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
