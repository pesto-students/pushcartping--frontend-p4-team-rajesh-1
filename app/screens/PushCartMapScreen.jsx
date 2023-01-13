import React, { useState, useContext, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, StatusBar, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import constants from '../config/constants'
import { UserContext } from '../context/UserContext';
import { db } from '../../firebase';

const PushCartMapScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const [location, setLocation] = useState(null);
    const ref = useRef();

    console.log("Hello key", process.env.GOOGLE_MAPS_API_KEY)

    useEffect(() => {
        var docRef = db.collection("dummyUsers").doc("user1");

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }, []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});

            console.log('LOCATION:');
            console.log(JSON.stringify(loc));

            let region = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004,
            }

            setLocation(region);
        })();
    }, []);

    useEffect(() => {
        // ref.current?.setAddressText('Some Text');
    }, [location]);

    const setNewAddress = (data, details) => {
        console.log('DATA');
        console.log(JSON.stringify(data));
        console.log('DETAILS');
        console.log(JSON.stringify(details));

        let region = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004,
        }

        setLocation(region);
    }

    const clearSearch = () => {
        ref.current?.clear();
        ref.current?.setAddressText('');
    }

    return (
        <View style={styles.container}>
            {
                location
                    ?
                    <>

                        {/* <Text style={styles.map}>Hello</Text> */}
                        <MapView
                            style={styles.map}
                            provider={MapView.PROVIDER_GOOGLE}
                            region={location}
                            showsUserLocation={true}
                        >
                            <Marker
                                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            // image={{ uri: 'custom_pin' }}
                            />
                        </MapView>
                        <GooglePlacesAutocomplete
                            ref={ref}
                            placeholder='Search'
                            fetchDetails={true}
                            onPress={(data, details = null) => setNewAddress(data, details)}
                            onFail={error => console.log(error)}
                            onNotFound={() => console.log('no results')}
                            query={{
                                key: process.env.GOOGLE_MAPS_API_KEY.toString(),
                                language: 'en',
                            }}
                            styles={styles.searchBar}
                            // renderLeftButton={() => <FontAwesome5 name="map-marker-alt" size={25} color="black" style={styles.searchButton} />}
                            renderRightButton={() =>
                                <TouchableOpacity
                                    onPress={() => {
                                        clearSearch();
                                    }}>
                                    <Ionicons name="close" size={30} color="black" style={styles.clearButton} />
                                </TouchableOpacity>
                            }
                        />
                        <View style={styles.header}>
                            <Text style={styles.header_text}>4 Push Carts <Text style={{ fontWeight: 'normal' }}>detected nearby</Text></Text>
                            <Ionicons style={styles.header_filter} name="md-options-outline" size={30} color="black" />
                        </View>
                    </>
                    :
                    <Text>Waiting for location</Text>
            }




            {/* {user
                ?
                <Text>
                    User UID: {user.uid}{"\n"}
                    User Phone: {user.phoneNumber}{"\n"}
                    User Name: {user.displayName}{"\n"}
                </Text>
                :
                <Text>No User Found</Text>
            } */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        top: StatusBar.currentHeight,
        // borderWidth: 3,
    },
    searchBar: {
        container: {
            flex: 1,
            position: 'absolute',
            width: '100%',
            // height: 10,
            // top: StatusBar.currentHeight,
            // borderWidth: 3,
            // backgroundColor: 'green',
        },
        textInput: {
            backgroundColor: constants.colorSecondary,
            width: '100%',
            height: 35,
            color: '#0',
            margin: 10,
            // fontSize: 18,
            // flex: 1,
        },
    },
    map: {
        // flex: 2,
        margin: 10,
        width: '95%',
        height: 300,
        top: 20,
    },
    searchButton: {
        marginVertical: 10,
        marginLeft: 10,
        backgroundColor: constants.colors,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButton: {
        marginVertical: 10,
        marginRight: 5,
        // backgroundColor: constants.colorPrimary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        width: '100%',
        height: 40,
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    header_text: {
        flex: 5,
        justifyContent: 'flex-start',
        fontWeight: 'bold',
        fontSize: 22,
    },
    header_filter: {
        // flex: 1,
        justifyContent: 'flex-end',
    },
})

export default PushCartMapScreen