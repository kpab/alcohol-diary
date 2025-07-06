import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';
import { AD_UNIT_IDS } from '../services/adService';

interface BannerAdProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
}

export const BannerAd: React.FC<BannerAdProps> = ({ size = 'banner' }) => {
  const handleAdFailedToLoad = (error: string) => {
    console.warn('バナー広告読み込み失敗:', error);
  };

  return (
    <View style={styles.container}>
      <AdMobBanner
        bannerSize={size}
        adUnitID={AD_UNIT_IDS.banner!}
        servePersonalizedAds={false}
        onDidFailToReceiveAdWithError={handleAdFailedToLoad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});