import { StyleSheet, TextInput, View, Image } from 'react-native'
import React from 'react'

import constants from '../config/constants'

const InputPCP = ({ containerStyle = {}, placeholder = 'Enter value', defaultValue, textColor = 'white', keyboardType = 'phone-pad', autoCompleteType = 'tel', icon = null, iconStyle = {}, onChangeText }) => {
    return (
        <View style={containerStyle}>
            <TextInput
                style={{
                    backgroundColor: constants.colorWhite,
                    color: constants.colorBlack,
                    paddingLeft: 40,
                    paddingRight: 10,
                    borderRadius: 15,
                    height: '100%',
                }}
                placeholder={placeholder}
                defaultValue={defaultValue ? defaultValue : null}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                autoCompleteType={autoCompleteType}
            // textAlign={'center'}
            />
            {icon
                ?
                <Image
                    source={icon}
                    style={iconStyle}
                />
                :
                <></>
            }
        </View>
    )
}

export default InputPCP

const styles = StyleSheet.create({})