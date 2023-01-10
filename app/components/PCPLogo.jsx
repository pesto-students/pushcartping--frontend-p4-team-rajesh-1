import { StyleSheet, View, Text, Image, StatusBar } from 'react-native'
import React from 'react'

const PCPLogo = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/icon.png')} style={styles.img} />
            <Text style={styles.tagline}>pushcartping</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    img: {
        width: 70,
        height: 70,
    },

    tagline: {
        left: 10,
        fontSize: 20,
        fontWeight: 'bold',
    }
})

export default PCPLogo