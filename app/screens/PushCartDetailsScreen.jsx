import { Dimensions, StyleSheet, Text, View, Image, ImageBackground } from 'react-native'
import React, { useContext, useEffect } from 'react'

import { PushCartContext } from '../context/PushCartContext';

let width = Dimensions.get('window').width;

const PushCartDetailsScreen = () => {
    const { selectedPushCart, setSelectedPushCart } = useContext(PushCartContext);

    useEffect(() => {
        console.log(selectedPushCart)
    }, [selectedPushCart])

    return (
        <View style={styles.container}>
            <ImageBackground
                // blurRadius={0}
                // source={require('../assets/welcome.jpg')}
                resizeMode='cover'
                style={styles.background}>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>{selectedPushCart.name}</Text>
                <Image
                    style={{ width: width * .6, aspectRatio: 1, resizeMode: 'contain', marginBottom: 10 }}
                    source={{ uri: selectedPushCart.photoURL[0], }}
                />
                {/* <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>CATEGORY</Text> */}
                <Text style={[styles.textStyle, {
                    fontWeight: 'normal',
                    marginBottom: 10,
                    color: 'white',
                    borderRadius: 5,
                    marginTop: 5,
                    backgroundColor: 'green',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    textAlign: 'center',
                }]}>{selectedPushCart.category}</Text>

                {/* <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>DESCRIPTION</Text> */}
                <Text style={[styles.textStyle, { width: width * .6, numberOfLines: 5, textAlign: 'center', marginBottom: 10 }]}>{selectedPushCart.description}</Text>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>TAGLINE</Text>
                <Text style={[styles.textStyle, { fontWeight: 'normal', marginBottom: 10 }]}>#{selectedPushCart.tagline}</Text>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>PHONE</Text>
                <Text style={[styles.textStyle, { fontWeight: 'normal', marginBottom: 10 }]}>{selectedPushCart.phone}</Text>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>EMAIL</Text>
                <Text style={[styles.textStyle, { fontWeight: 'normal', marginBottom: 10 }]}>{selectedPushCart.email}</Text>

                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>REVIEWS</Text>
                <Text style={[styles.textStyle, { width: width * .6, numberOfLines: 5, textAlign: 'center', marginBottom: 10 }]}>No reviews yet! Please check back in a bit, we should have something. Or you could post your own</Text>
            </ImageBackground>
        </View>
    )
}

export default PushCartDetailsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        // padding: 20,
    },
    background: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    textStyle: {
        color: 'black',
    }
})