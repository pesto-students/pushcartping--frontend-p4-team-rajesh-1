import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'

import { UserContext } from '../context/UserContext';

const NewVendorScreen = () => {
    const { userData, setUserData } = useContext(UserContext);

    return (
        <View>
            <Text>USERTYPE: {userData.type}</Text>
        </View>
    )
}

export default NewVendorScreen

const styles = StyleSheet.create({})