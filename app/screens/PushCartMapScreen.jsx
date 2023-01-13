import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, View, Text, StatusBar } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { UserContext } from '../context/UserContext';
import { db } from '../../firebase';

const PushCartMapScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const [location, setLocation] = useState(null);

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

    return (
        <View style={styles.container}>
            {/* <StatusBar hidden></StatusBar> */}
            {
                location
                    ?
                    <>
                        <GooglePlacesAutocomplete
                            placeholder='Search'
                            fetchDetails={true}
                            onPress={(data, details = null) => console.log(data, details)}
                            onFail={error => console.log(error)}
                            onNotFound={() => console.log('no results')}
                            query={{
                                key: process.env.GOOGLE_MAPS_API_KEY.toString(),
                                language: 'en',
                            }}
                        />

                        <MapView
                            style={styles.map}
                            provider={MapView.PROVIDER_GOOGLE}
                            initialRegion={location}
                            showsUserLocation={true}
                        >
                            <Marker
                                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            // image={{ uri: 'custom_pin' }}
                            />
                        </MapView>
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
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '50%',
        top: 50,
    },
})

export default PushCartMapScreen