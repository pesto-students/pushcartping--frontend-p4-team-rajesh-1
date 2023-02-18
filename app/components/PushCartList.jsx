import { StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { axGetAllVendorsFromDB } from '../context/axiosAPI';
import { PushCartContext } from '../context/PushCartContext';
import PushCart from './PushCart'

const PushCartList = ({ navigateToPushCart, trigger }) => {
    const { pushCartList, setPushCartList } = useContext(PushCartContext);
    const refFlatList = useRef(null)

    const scrolltoListItem = () => {
        // console.log('PushCartList scrolltoListItem')
    }

    useEffect(() => {
        async function fetchData() {
            // console.log("trying to load all push carts");
            let response = await axGetAllVendorsFromDB()
            // console.log('PushCartList useEffect :', response)
            setPushCartList(response.data)
        }
        fetchData();

        return () => {

        }
    }, []);

    useEffect(() => {
        if (trigger) {
            log(trigger);
        }
    }, [trigger]);

    const log = (trigger) => {
        // console.log("call from parent");

        if (trigger < 0)
            return;

        if (trigger === 0)
            refFlatList.current?.scrollToOffset({ animated: true, offset: trigger });
        else
            refFlatList.current?.scrollToIndex({ animated: true, index: trigger });
    };

    const refreshCarts = async () => {
        // console.log("trying to load all push carts");
        let response = await axGetAllVendorsFromDB()
        // console.log('PushCartList useEffect :', response)
        setPushCartList(response.data)
    }

    return (
        <>
            <TouchableOpacity onPress={() => refreshCarts()} style={styles.header}>
                <Text style={styles.header_text}>{pushCartList.length} Push Carts <Text style={{ fontWeight: 'normal' }}>detected near you</Text></Text>
                <Ionicons style={styles.header_filter} name="refresh-sharp" size={30} color="black" />
            </TouchableOpacity>

            {
                pushCartList
                &&
                <FlatList
                    ref={refFlatList}
                    data={Object.values(pushCartList)}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            onPress={() => {
                                console.log('somthing with item: ', item)
                                navigateToPushCart(item)
                            }}>
                            <PushCart cart={item} />
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.name}
                    style={styles.carts}
                />
            }
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
        marginBottom: 10,
    },
})