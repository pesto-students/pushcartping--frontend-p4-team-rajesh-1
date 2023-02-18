import React, { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { PushCartContext } from '../context/PushCartContext';
import { MapDisplay, PushCartList } from '../components';
import constants from '../config/constants';

const PushCartMapScreen = ({ navigation }) => {
    const { pushCartList, setPushCartList, selectedPushCart, setSelectedPushCart } = useContext(PushCartContext);
    const [trigger, setTrigger] = useState(-1);

    // console.log("Hello key", process.env.GOOGLE_MAPS_API_KEY)

    const scrollToItem = (index) => {
        console.log('call scrolltoitem in PushCartMapScreen, index:', index)
        console.log('call scrolltoitem in PushCartMapScreen, trigger:', trigger)

        setTrigger(index);
    }

    const navigateToPushCart = (item) => {
        console.log('tryin to navigate to pushcart, index:', item)
        setSelectedPushCart(item)
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
