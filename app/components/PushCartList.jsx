import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import constants from '../config/constants'
import { getVendorsFromDB } from '../../firebase';
import { PushCartContext } from '../context/PushCartContext';
import PushCart from './PushCart'

const PushCartList = ({ navigateToPushCart, trigger }) => {
    const { pushCartList, setPushCartList } = useContext(PushCartContext);
    const refFlatList = useRef(null)

    const scrolltoListItem = () => {
        console.log('PushCartList scrolltoListItem')
    }

    // const fetchData = async () => {
    //     try {
    //         console.log("trying to get all push carts");
    //         const samplePushcarts = await getVendorsFromDB()
    //         return samplePushcarts
    //         // setPushCartList(samplePushcarts);
    //     } catch (error) {
    //         console.log("UserContext error:", error);
    //     }
    // };

    useEffect(() => {
        console.log("trying to load all push carts");
        // const data = fetchData()
        getVendorsFromDB()
            .then((data) => setPushCartList(data))
            .catch((error) => console.log('Error in fetching pushcarts:', error))
    }, []);

    useEffect(() => {
        if (trigger) {
            log(trigger);
        }
    }, [trigger]);

    const log = (trigger) => {
        console.log("call from parent");

        if (trigger < 0)
            return;

        if (trigger === 0)
            refFlatList.current?.scrollToOffset({ animated: true, offset: trigger });
        else
            refFlatList.current?.scrollToIndex({ animated: true, index: trigger });
    };

    const tempCheck = () => {
        console.log('pressed: ', pushCartList)
        Object.values(pushCartList).map((item, index) => {
            console.log('index:', index)
            console.log('item:', typeof item.location['latitude'])
        })
    }

    return (
        <>
            <TouchableOpacity onPress={() => tempCheck()} style={styles.header}>
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
                                // navigateToPushCart(item.id)
                            }}>
                            <PushCart cart={item} />
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.name}
                    // contentContainerStyle={{
                    //     flexGrow: 1,
                    //     paddingBottom: 20,
                    // }}
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
        marginBottom: 30,
    },
})