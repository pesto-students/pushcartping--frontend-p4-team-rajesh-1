import { View, TouchableOpacity, Text } from 'react-native'
import React from 'react'

const ButtonPCP = ({ title = 'button', color = 'black', textColor = 'white', onPress }) => {
    return (
        <View
            style={{
                // justifyContent: 'center',
                // alignItems: 'center',
                // alignSelf: 'center',
            }}
        >
            <TouchableOpacity
                style={{
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: color,
                }}
                onPress={onPress}
            >
                <Text
                    style={{
                        color: textColor,
                    }}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default ButtonPCP