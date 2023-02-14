import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import { PushCartMapScreen, PushCartDetailsScreen, WelcomeScreen, VendorProfileScreen } from './app/screens'
import { PushCartContextProvider } from './app/context/PushCartContext';
import constants from './app/config/constants';

import { store } from './app/context/store'
import { Provider } from 'react-redux'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PushCartContextProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={constants.screenHome} screenOptions={{ headerShown: false }}>
              <Stack.Screen name={constants.screenHome} component={WelcomeScreen} />
              <Stack.Screen name={constants.screenPushCartMap} component={PushCartMapScreen} />
              <Stack.Screen name={constants.screenPushCartDetails} component={PushCartDetailsScreen} />
              <Stack.Screen name={constants.screenVendorProfile} component={VendorProfileScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PushCartContextProvider>
    </Provider>
  );
}
