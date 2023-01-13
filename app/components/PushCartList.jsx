import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

import constants from '../config/constants'
import { PushCartContext } from '../context/PushCartContext';
import PushCart from './PushCart'

const PushCartList = () => {
    const { pushCartList, setPushCartList } = useContext(PushCartContext);

    return (
        <>
            <TouchableOpacity onPress={() => console.log('pressed')} style={styles.header}>
                <Text style={styles.header_text}>{pushCartList.length} Push Carts <Text style={{ fontWeight: 'normal' }}>detected near you</Text></Text>
                <Ionicons style={styles.header_filter} name="refresh-sharp" size={30} color="black" />
            </TouchableOpacity>
            {/* <PushCart cart={samplePushcarts[0]} /> */}

            <FlatList
                data={pushCartList}
                renderItem={({ item }) => <PushCart cart={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 20,
                }}
                style={styles.carts}
            />
        </>
    )
}

export default PushCartList

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
    },
    header_text: {
        flex: 10,
        justifyContent: 'flex-start',
        fontWeight: 'bold',
        fontSize: 18,
    },
    header_filter: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    carts: {
        paddingHorizontal: 10,
        marginBottom: 20,
    },
})