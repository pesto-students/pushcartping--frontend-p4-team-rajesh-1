import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'

const InputPCP = ({ placeholder = 'Enter value', defaultValue = 'Some text', keyboardType = 'phone-pad', autoCompleteType = 'tel', onChangeText }) => {
    return (
        <View>
            <TextInput
                // style={styles.text}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                autoCompleteType={autoCompleteType}
                textAlign={'center'}
            />
        </View>
    )
}

export default InputPCP

const styles = StyleSheet.create({})