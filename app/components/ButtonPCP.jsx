import { View, TouchableOpacity, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'

const ButtonPCP = ({ containerStyle = {}, title = 'button', color = 'black', textColor = 'white', onPress }) => {
    return (
        <View style={containerStyle}>
            <LinearGradient
                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                locations={[0, 1.0]}
                colors={['#9929ea', '#5808fb']}
                style={{
                    borderRadius: 15,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    height: 40,
                    // backgroundColor: color,
                }}>
                <TouchableOpacity
                    onPress={onPress}
                >
                    <Text
                        style={{
                            color: textColor,
                            textAlign: 'center',
                        }}
                    >
                        {title}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    )
}

export default ButtonPCP