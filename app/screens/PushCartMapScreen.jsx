import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'

import { UserContext } from '../context/UserContext';
import { PushCartContext } from '../context/PushCartContext';
import { db } from '../../firebase';
import { MapDisplay, PushCartList } from '../components';
import constants from '../config/constants';

const PushCartMapScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const { pushCartList, setPushCartList, selectedPushCart, setSelectedPushCart } = useContext(PushCartContext);
    const [trigger, setTrigger] = useState(0);

    // console.log("Hello key", process.env.GOOGLE_MAPS_API_KEY)

    const scrollToItem = (index) => {
        console.log('call scrolltoitem in PushCartMapScreen, index:', index)
        setTrigger(index);
    }

    const navigateToPushCart = (index) => {
        console.log('tryin to navigate to pushcart, index:', index)
        setSelectedPushCart(pushCartList[index - 1])
        navigation.navigate(constants.screenPushCartDetails)
    }

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
                <MapDisplay scrollToItem={scrollToItem} />
            </View>
            <PushCartList navigateToPushCart={navigateToPushCart} trigger={trigger} />
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
