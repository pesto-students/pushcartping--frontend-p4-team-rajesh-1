import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const PCPButton = ({ text = '--title--', color = 'black', bgcolor = 'dodgerblue', onPress }) => {
    const onPressDefault = () => {
        console.log("Something pressed");
    }

    return (
        <TouchableOpacity
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: bgcolor,
                width: '100%',
                height: 40,
                borderColor: 'black',
                borderWidth: 2,
                borderRadius: 30,
                margin: 2,
            }}
            onPress={onPress ? onPress : onPressDefault}
        >
            <Text style={{
                fontFamily: 'normal',
                fontSize: 14,
                fontWeight: 'bold',
                color: color,
            }}
            >
                {text}
            </Text>
        </TouchableOpacity>
    )
}

export default PCPButton