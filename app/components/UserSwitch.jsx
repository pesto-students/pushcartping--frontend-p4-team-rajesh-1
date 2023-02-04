import { StyleSheet, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import SwitchSelector from 'react-native-switch-selector'

import constants from '../config/constants';
import { UserContext } from '../context/UserContext';

const UserSwitch = ({ containerStyle = {}, containerMargin = [0, 0, 0, 0] }) => {
    const { userData, setUserData } = useContext(UserContext);

    // useEffect(() => {
    //     setUserData({ type: constants.userTypeCustomer })
    // }, []);

    return (
        <View style={containerStyle}>
            <SwitchSelector
                initial={constants.userTypeCustomer}
                onPress={value => setUserData({ type: value })}
                textColor={constants.colorBlack}
                selectedColor={constants.colorWhite}
                buttonColor={constants.colorButton}
                borderColor={constants.colorBackground}
                height={40}
                borderRadius={15}
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
