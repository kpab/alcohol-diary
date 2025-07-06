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
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    outline: '#E9ECEF',
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
