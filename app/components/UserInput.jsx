import { StyleSheet, TextInput, Button } from 'react-native'
import React from 'react'

const UserInput = ({ placeholder = 'Enter value', defaultValue = 'Some text', buttonTitle = 'Button', buttonColor = 'dodgerblue', accessibilityLabel = 'Accesibility Label', onChangeText, onButtonPress }) => {
    return (
        <>
            <TextInput
                style={styles.text}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChangeText={onChangeText}
                keyboardType="phone-pad"
                autoCompleteType="tel"
                textAlign={'center'}
            />

            <Button
                style={styles.button}
                onPress={onButtonPress}
                title={buttonTitle}
                color={buttonColor}
                accessibilityLabel={accessibilityLabel}
            />
        </>
    )
}

export default UserInput

const styles = StyleSheet.create({
    text: {
        position: 'relative',
        height: 40,
    },
    button: {
        position: 'relative',
        height: 40,
    }
})