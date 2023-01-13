import React, { useState, useContext, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'

import { UserContext } from '../context/UserContext';
import { PushCartContext } from '../context/PushCartContext';
import { db } from '../../firebase';
import { MapDisplay, PushCartList } from '../components';
import constants from '../config/constants';

const PushCartMapScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const { pushCartList, setPushCartList } = useContext(PushCartContext);

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

    return (
        <View style={styles.container}>
            <View style={styles.mapDisplay}>
                <MapDisplay />
            </View>
            <PushCartList />
        </View>
    )
}

export default PushCartMapScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: constants.colorBackground,
        flex: 1,
        flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
        top: StatusBar.currentHeight,
    },
    mapDisplay: {
        // flex: 1,
        backgroundColor: 'lightgrey',
        width: '100%',
        height: 400,
    },
})
