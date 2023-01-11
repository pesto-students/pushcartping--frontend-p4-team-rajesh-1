import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WelcomeScreen, PushCartMapScreen } from './app/screens'
import { UserContextProvider } from './app/context/UserContext';
import constants from './app/config/constants';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={constants.screenHome} screenOptions={{ headerShown: false }}>
          <Stack.Screen name={constants.screenHome} component={WelcomeScreen} />
          <Stack.Screen name={constants.screenPushCartMap} component={PushCartMapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}
