import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import { WelcomeScreen, PushCartMapScreen, NewVendorScreen, PushCartDetailsScreen } from './app/screens'
import { UserContextProvider } from './app/context/UserContext';
import { PushCartContextProvider } from './app/context/PushCartContext';
import constants from './app/config/constants';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserContextProvider>
      <PushCartContextProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={constants.screenHome} screenOptions={{ headerShown: false }}>
              <Stack.Screen name={constants.screenHome} component={WelcomeScreen} />
              <Stack.Screen name={constants.screenPushCartMap} component={PushCartMapScreen} />
              <Stack.Screen name={constants.screenPushCartDetails} component={PushCartDetailsScreen} />
              <Stack.Screen name={constants.screenNewVendor} component={NewVendorScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PushCartContextProvider>
    </UserContextProvider>
  );
}
