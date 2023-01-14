import { StyleSheet, View, Text, Image, StatusBar } from 'react-native'
import React from 'react'

const PCPLogo = () => {
    return (
        <>
            <View style={styles.container}>
                <Image source={require('../assets/icon.png')} style={styles.img} />
                <Text style={styles.tagline}>pushcartping</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center'
    },

    img: {
        position: 'absolute',
        width: 70,
        height: 70,
        alignItems: 'center'
    },

    tagline: {
        position: 'absolute',
        top: 75,
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center'
    }
})

export default PCPLogo