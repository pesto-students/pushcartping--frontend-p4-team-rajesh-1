import { StyleSheet, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import SwitchSelector from 'react-native-switch-selector'

import constants from '../config/constants';
// import { UserContext } from '../context/UserContext';
import { addUserEntry } from '../context/rootSlice';

const UserSwitch = ({ containerStyle = {}, containerMargin = [0, 0, 0, 0], callback }) => {
    // const { userData, setUserData } = useContext(UserContext);

    return (
        <View style={containerStyle}>
            <SwitchSelector
                initial={constants.defaultUserType}
                onPress={value => callback(value)}
                textColor={constants.colorBlack}
                selectedColor={constants.colorWhite}
                buttonColor={constants.colorButton}
                borderColor={constants.colorBackground}
                height={40}
                borderRadius={15}
                hasPadding
                options={[
                    { label: "Customer", value: constants.userTypeCustomer }, //images.feminino = require('./path_to/assets/img/feminino.png')
                    { label: "Vendor", value: constants.userTypeVendor }, //images.masculino = require('./path_to/assets/img/masculino.png')
                ]}
                testID="user-switch-selector"
                accessibilityLabel="user-switch-selector"
            />
        </View>
    )
}

export default UserSwitch
