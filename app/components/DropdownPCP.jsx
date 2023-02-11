import { StyleSheet, TextInput, View, Image } from 'react-native'
import React from 'react'

import constants from '../config/constants'

const InputPCP = ({
    editable = true,
    containerStyle = {},
    placeholder = 'Enter value',
    defaultValue, textColor = 'white',
    keyboardType = 'phone-pad',
    autoCompleteType = 'tel',
    icon = null, iconStyle = {},
    dropdownIcon = null, dropdownStyle = {},
    onChangeText }) => {
    return (
        <View style={containerStyle}>
            <TextInput
                style={{
                    backgroundColor: editable ? constants.colorWhite : constants.colorBackground,
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
                editable={editable}
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

            {dropdownIcon
                ?
                <Image
                    source={dropdownIcon}
                    style={dropdownStyle}
                />
                :
                <></>
            }
        </View>
    )
}

export default InputPCP

const styles = StyleSheet.create({})