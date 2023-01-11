import { TouchableOpacity, Text, TextInput } from 'react-native'
import React from 'react'

const PCPTextInput = (props) => {
    const onPressDefault = () => {
        console.log("Something pressed");
    }

    return (
        <TextInput
            placeholder="Phone Number"
            onChangeText={props.setPhoneNumber}
            keyboardType="phone-pad"
            autoCompleteType="tel"

            style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: props.bgcolor,
                width: '100%',
                height: 40,
                borderColor: 'black',
                borderWidth: 2,
                borderRadius: 30,
                margin: 2,
                textAlign: 'center',
            }}
        />
    )
}

export default PCPTextInput