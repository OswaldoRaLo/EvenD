import React, { useState } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import AuthNavigator from './AuthNavigator';
import { AuthProvider } from './AuthContext';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Helvetica': require('./assets/Helvetica.ttf'),
      'Century': require('./assets/Century.ttf'),
      'Glacial': require('./assets/Glacial.ttf'),

    });
    setFontsLoaded(true);
  };

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={(error) => console.error(error)}
      />
    );
  }

  return (
    <AuthProvider>
      <AuthNavigator />
    </AuthProvider>
  );
}
