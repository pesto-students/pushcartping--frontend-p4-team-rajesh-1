import { Dimensions, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext, useEffect } from 'react'

import { PushCartContext } from '../context/PushCartContext';

let width = Dimensions.get('window').width;

const PushCartDetailsScreen = () => {
    const { selectedPushCart, setSelectedPushCart } = useContext(PushCartContext);

    useEffect(() => {
        console.log(selectedPushCart)
    }, [selectedPushCart])

    return (
        <>
            <View style={styles.container}>
                <Text style={{ fontWeight: 'bold' }}>{selectedPushCart.name}</Text>
                <Image
                    style={{ width: width * .6, aspectRatio: 1, resizeMode: 'contain' }}
                    source={{ uri: selectedPushCart.photoURL[0], }}
                />
                <Text><Text style={{ fontWeight: 'bold' }}>CATEGORY:</Text> {selectedPushCart.category}</Text>
                <Text style={{ width: width * .6, numberOfLines: 5 }}><Text style={{ fontWeight: 'bold' }}>DESCRIPTION:</Text> {selectedPushCart.description}</Text>
                <Text style={{ fontWeight: 'bold' }}>TAGLINE: #{selectedPushCart.tagline}</Text>
                <Text><Text style={{ fontWeight: 'bold' }}>PHONE:</Text> {selectedPushCart.phone}</Text>
                <Text><Text style={{ fontWeight: 'bold' }}>EMAIL:</Text> {selectedPushCart.email}</Text>
            </View>
            <View>
                <Text>We will show some reviews here:</Text>
            </View>
        </>
    )
}

export default PushCartDetailsScreen

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
})