import { View, TouchableOpacity, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'

const ButtonPCP = ({ containerStyle = {}, title = 'button', colorArray = ['#9929ea', '#5808fb'], textColor = 'white', disabled = false, onPress }) => {
    return (
        <View style={containerStyle}>
            <LinearGradient
                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                locations={[0, 1.0]}
                colors={colorArray}
                style={{
                    borderRadius: 15,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                }}>
                <TouchableOpacity
                    onPress={onPress}
                    disabled={disabled}
                >
                    <Text
                        style={{
                            color: textColor,
                            textAlign: 'center',
                            fontWeight: 'bold',
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