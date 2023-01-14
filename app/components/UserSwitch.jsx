import { StyleSheet, Text, View, Switch } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import SwitchSelector from 'react-native-switch-selector'

import constants from '../config/constants';
import { UserContext } from '../context/UserContext';

const UserSwitch = () => {
    const { userType, setUserType } = useContext(UserContext);
    const [isON, setIsON] = useState(true);

    const toggleSwitch = () => {
        setIsON(previousState => !previousState);
    }

    useEffect(() => {
        isON ? setUserType(constants.userTypeVendor) : setUserType(constants.userTypeCustomer)
    }, [isON]);

    return (
        <View style={styles.container}>
            <SwitchSelector
                initial={constants.userTypeCustomer}
                onPress={toggleSwitch}
                textColor={constants.colorBlack} //'#7a44cf'
                selectedColor={constants.colorWhite}
                buttonColor={constants.colorButton}
                borderColor={constants.colorBackground}
                hasPadding
                options={[
                    { label: "Customer", value: constants.userTypeCustomer }, //images.feminino = require('./path_to/assets/img/feminino.png')
                    { label: "Vendor", value: constants.userTypeVendor } //images.masculino = require('./path_to/assets/img/masculino.png')
                ]}
                testID="user-switch-selector"
                accessibilityLabel="user-switch-selector"
            />
        </View>
    )
}

export default UserSwitch

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
})