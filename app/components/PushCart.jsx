import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import call from 'react-native-phone-call';
import * as SMS from 'expo-sms';

import constants from '../config/constants'

const PushCart = ({ cart }) => {
    const makeACall = () => {
        const args = {
            number: cart.phone, // String value with the number to call
            prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call 
            skipCanOpen: true // Skip the canOpenURL check
        }

        call(args).catch(console.error)
    }

    const sendAnSMS = async () => {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            // do your SMS stuff here
            const { result } = await SMS.sendSMSAsync(
                [cart.phone],
                'Sending a test message',
            );
        } else {
            // misfortune... there's no SMS available on this device
            console.log('no SMS service available')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <Image source={cart.imageURL} style={styles.image}></Image>
            </View>
            <View style={styles.desc}>
                <Text style={{ color: 'white', fontSize: 12, backgroundColor: constants.mapPinColorList[cart.id], paddingHorizontal: 5, alignSelf: 'flex-start' }}>{cart.distance}m away</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{cart.name}</Text>
                <Text style={{ fontSize: 14 }}>{cart.averageCost > 0 ? "₹" + cart.averageCost : 'N/A'} | {cart.category}</Text>
                <Text style={{ fontSize: 14 }}>{cart.short_desc}</Text>
                <Text style={{ fontSize: 14, color: constants.colorWhite, backgroundColor: 'green', paddingHorizontal: 5, alignSelf: 'flex-start' }}>{cart.rating}</Text>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={makeACall}>
                <Ionicons name="md-call-sharp" size={20} color="purple" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.msgButton} onPress={sendAnSMS}>
                <Ionicons name="md-chatbox-sharp" size={20} color="purple" />
            </TouchableOpacity>
        </View>
    )
}

export default PushCart

const styles = StyleSheet.create({
    container: {
        backgroundColor: constants.colorWhite,
        borderRadius: 15,
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginVertical: 5,
    },
    icon: {
        flex: 1,
    },
    desc: {
        flex: 2,
        justifyContent: 'space-around',
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 10,
    },
    callButton: {
        position: 'absolute',
        // backgroundColor: 'purple',
        borderRadius: 20,
        // padding: 10,
        top: 10,
        right: 40,
        // alignSelf: 'flex-start'
    },
    msgButton: {
        position: 'absolute',
        // backgroundColor: 'purple',
        borderRadius: 20,
        // padding: 10,
        top: 10,
        right: 10,
        // alignSelf: 'flex-start'
    },
})