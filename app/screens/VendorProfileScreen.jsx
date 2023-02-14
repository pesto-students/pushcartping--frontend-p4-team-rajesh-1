import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const VendorProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={{ fontWeight: 'bold' }}>VendorProfile</Text>
            <Text>Name Goes Here</Text>
        </View>
    )
}

export default VendorProfileScreen

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
})