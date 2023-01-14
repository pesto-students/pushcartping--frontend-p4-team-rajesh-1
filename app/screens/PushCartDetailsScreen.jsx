import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'

import { PushCartContext } from '../context/PushCartContext';

const PushCartDetailsScreen = () => {
    const { selectedPushCart, setSelectedPushCart } = useContext(PushCartContext);

    return (
        <View style={styles.container}>
            {
                Object.entries(selectedPushCart).map(([key, value]) => <Text>{key} : {value}</Text>)
            }
        </View>
    )
}

export default PushCartDetailsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 20,
    }
})