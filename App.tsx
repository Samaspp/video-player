// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import UploadScreen from './screens/UploadScreen';
import PlayerScreen from './screens/PlayerScreen';
import SettingsScreen from './screens/SettingsScreen';
import { AppProvider } from './context/AppContext';

export type RootStackParamList = {
  Upload: undefined;
  Settings: undefined;
  Player: {
    videoUri: string;
    watermarkEnabled: boolean;
    securityEnabled: boolean;
    secureMode: boolean;
    username: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen name="Player" component={PlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
