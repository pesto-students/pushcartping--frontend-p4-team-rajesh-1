import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WelcomeScreen } from './screens'

export default function App() {
  return (
    <View style={styles.container}>
      <WelcomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
