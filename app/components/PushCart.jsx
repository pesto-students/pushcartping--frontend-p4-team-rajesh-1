import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import call from 'react-native-phone-call';
import * as SMS from 'expo-sms';
import { getDistance, getPreciseDistance } from 'geolib';

import constants from '../config/constants'
import { UserContext } from '../context/UserContext';

const PushCart = ({ cart }) => {
    const { userData } = useContext(UserContext);
    const [distance, setDistance] = useState(0)


    const makeACall = () => {
        const args = {
            number: cart.phone ? cart.phone : '+919999999999', // String value with the number to call
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
                [cart.phone ? cart.phone : '+919999999999'],
                'Hi there, can we talk?',
            );
        } else {
            // misfortune... there's no SMS available on this device
            console.log('no SMS service available')
        }
    }

    const getDistanceFromUser = () => {
        if (!userData.loc) {
            console.log('cannot getDistanceFromUser')
            return
        }
        let dis = getDistance(
            { latitude: userData.loc['lat'], longitude: userData.loc['lng'] },
            { latitude: cart.location['latitude'], longitude: cart.location['longitude'] }
        );
        console.log('getDistanceFromUser: ', dis)
        setDistance(dis)
    }

    useEffect(() => {
        getDistanceFromUser()
    }, [userData]);

    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <Image source={{ uri: cart.photoURL[0] }} style={styles.image}></Image>
            </View>
            <View style={styles.desc}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 14, color: constants.colorWhite, backgroundColor: 'green', paddingHorizontal: 5 }}>{cart.rating ? cart.rating : '0.0'}</Text>
                    <Text style={{ color: 'purple', fontSize: 12, marginLeft: 5 }}>{distance}m away</Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{cart.name}</Text>
                    <Text style={{ fontSize: 14 }}>{cart.category} | {cart.averageCost ? cart.averageCost > 0 ? "₹" + cart.averageCost : 'N/A' : 'N/A'}</Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Text style={{ fontSize: 14 }}>{cart.description}</Text>
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
        </View >
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