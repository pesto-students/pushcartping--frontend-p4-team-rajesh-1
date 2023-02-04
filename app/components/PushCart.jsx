import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
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
                'Hi there, can we talk?',
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
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 14, color: constants.colorWhite, backgroundColor: 'green', paddingHorizontal: 5 }}>{cart.rating}</Text>
                    <Text style={{ color: 'purple', fontSize: 12, marginLeft: 5 }}>{cart.distance}m away</Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{cart.name}</Text>
                    <Text style={{ fontSize: 14 }}>{cart.category} | {cart.averageCost > 0 ? "₹" + cart.averageCost : 'N/A'}</Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Text style={{ fontSize: 14 }}>{cart.short_desc}</Text>
                </View>

                <TouchableOpacity onPress={sendAnSMS}>
                    <Text style={styles.msgButton}>SEND MESSAGE</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={makeACall}>
                <Image
                    style={styles.callButton}
                    source={require('../assets/input_icons/phone.png')}
                />
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
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 20,
        marginLeft: -5,
    },
    callButton: {
        position: 'absolute',
        width: 30,
        height: 30,
        top: 0,
        right: 0,
    },
    msgButton: {
        fontSize: 12,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 5,
        width: '50%',
        textAlign: 'center',
    },
})