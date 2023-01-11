import { StyleSheet, View, Text } from 'react-native'
import React, { useContext } from 'react'

import { UserContext } from '../context/UserContext';

const PushCartMapScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);

    return (
        <View style={styles.container}>
            {user
                ?
                <Text>
                    User UID: {user.uid}{"\n"}
                    User Phone: {user.phoneNumber}{"\n"}
                    User Name: {user.displayName}{"\n"}
                </Text>
                :
                <Text>No User Found</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default PushCartMapScreen