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
    const [trigger, setTrigger] = useState(-1);

    // console.log("Hello key", process.env.GOOGLE_MAPS_API_KEY)

    const scrollToItem = (index) => {
        console.log('call scrolltoitem in PushCartMapScreen, index:', index)
        console.log('call scrolltoitem in PushCartMapScreen, trigger:', trigger)

        setTrigger(index);
    }

    const navigateToPushCart = (index) => {
        console.log('tryin to navigate to pushcart, index:', index)
        setSelectedPushCart(pushCartList[index - 1])
        navigation.navigate(constants.screenPushCartDetails)
    }

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
        // top: StatusBar.currentHeight,
    },
    mapDisplay: {
        // flex: 1,
        backgroundColor: 'lightgrey',
        width: '100%',
        height: 400,
    },
})
