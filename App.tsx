import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { TabNavigator } from './src/navigation/TabNavigator';
import { AdService } from './src/services/adService';
import { PurchaseService } from './src/services/purchaseService';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#000000',
    secondary: '#666666',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    outline: '#E0E0E0',
    onSurface: '#212121',
    onBackground: '#212121',
  },
};

export default function App() {
  useEffect(() => {
    // サービス初期化
    AdService.initialize();
    PurchaseService.initialize();
    
    return () => {
      // クリーンアップ
      PurchaseService.cleanup();
    };
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <TabNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
