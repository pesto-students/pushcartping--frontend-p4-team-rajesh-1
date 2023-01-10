import React from 'react';
import { View, StyleSheet, ImageBackground, Image, Text } from 'react-native'

import colors from '../config/constants'
import { PCPLogo, PCPButton } from '../components';

export default function WelcomeScreen() {
    return (
        <ImageBackground
            blurRadius={5}
            source={require('../assets/welcome.jpg')}
            resizeMode='cover'
            style={styles.background}>

            <PCPLogo />
            <PCPButton text='Login' bgcolor={colors.primary} />
            <PCPButton text='Register' bgcolor={colors.secondary} />

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
})

