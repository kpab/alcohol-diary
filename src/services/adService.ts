import { AdMobBanner, AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';
import { Platform } from 'react-native';

// AdMob Unit IDs (テスト用ID - 本番では実際のIDに変更)
export const AD_UNIT_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716', // テスト用
    android: 'ca-app-pub-3940256099942544/6300978111', // テスト用
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910', // テスト用
    android: 'ca-app-pub-3940256099942544/1033173712', // テスト用
  }),
};

export class AdService {
  private static isInitialized = false;
  private static adViewCount = 0;
  private static readonly AD_FREQUENCY = 3; // 3回に1回広告を表示

  static async initialize() {
    if (this.isInitialized) return;
    
    try {
      // テストデバイスの設定（開発時のみ）
      if (__DEV__) {
        await setTestDeviceIDAsync('EMULATOR');
      }
      
      // インタースティシャル広告を予めロード
      await this.loadInterstitialAd();
      
      this.isInitialized = true;
    } catch (error) {
      console.warn('AdMob初期化エラー:', error);
    }
  }

  static async loadInterstitialAd() {
    try {
      await AdMobInterstitial.setAdUnitID(AD_UNIT_IDS.interstitial!);
      await AdMobInterstitial.requestAdAsync();
    } catch (error) {
      console.warn('インタースティシャル広告読み込みエラー:', error);
    }
  }

  static async showInterstitialAd(): Promise<boolean> {
    try {
      const isReady = await AdMobInterstitial.getIsReadyAsync();
      if (isReady) {
        await AdMobInterstitial.showAdAsync();
        // 広告表示後に新しい広告をロード
        setTimeout(() => this.loadInterstitialAd(), 1000);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('インタースティシャル広告表示エラー:', error);
      return false;
    }
  }

  static async maybeShowInterstitialAd(): Promise<void> {
    this.adViewCount++;
    
    // 指定回数ごとに広告を表示
    if (this.adViewCount % this.AD_FREQUENCY === 0) {
      const shown = await this.showInterstitialAd();
      if (shown) {
        console.log('インタースティシャル広告を表示しました');
      }
    }
  }

  static resetAdCounter() {
    this.adViewCount = 0;
  }
}