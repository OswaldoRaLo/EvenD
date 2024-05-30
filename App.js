import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AuthNavigator from './AuthNavigator';
import { AuthProvider } from './AuthContext';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          'Helvetica': require('./assets/Helvetica.ttf'),
          'Century': require('./assets/Century.ttf'),
          'Glacial': require('./assets/Glacial.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthNavigator />
    </AuthProvider>
  );
}
