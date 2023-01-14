import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'

import { UserContext } from '../context/UserContext';

const NewVendorScreen = () => {
    const { userType, setUserType } = useContext(UserContext);

    return (
        <View>
            <Text>USERTYPE: {userType}</Text>
        </View>
    )
}

export default NewVendorScreen

const styles = StyleSheet.create({})