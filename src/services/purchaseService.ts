import { 
  initConnection, 
  purchaseUpdatedListener, 
  purchaseErrorListener,
  getProducts,
  requestPurchase,
  finishTransaction,
  Product,
  Purchase,
  PurchaseError,
  ProductPurchase,
} from 'react-native-iap';
import { Platform } from 'react-native';
import { StorageService } from './storage';

// 商品ID（Google Play Console/App Store Connectで設定した実際のIDに変更）
const PRODUCT_IDS = Platform.select({
  ios: ['alcohol_diary_premium'],
  android: ['alcohol_diary_premium'],
}) || [];

export class PurchaseService {
  private static isInitialized = false;
  private static purchaseUpdateSubscription: any;
  private static purchaseErrorSubscription: any;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      await initConnection();
      
      // 購入成功リスナー
      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: Purchase) => {
          console.log('購入成功:', purchase);
          
          if (purchase.productId === PRODUCT_IDS[0]) {
            // プレミアム機能を有効化
            await StorageService.setPremiumStatus(true);
            
            // 取引完了
            await finishTransaction({ purchase, isConsumable: false });
          }
        }
      );

      // 購入エラーリスナー
      this.purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.warn('購入エラー:', error);
        }
      );

      this.isInitialized = true;
    } catch (error) {
      console.warn('IAP初期化エラー:', error);
    }
  }

  static async getProducts(): Promise<Product[]> {
    try {
      const products = await getProducts({ skus: PRODUCT_IDS });
      return products;
    } catch (error) {
      console.warn('商品情報取得エラー:', error);
      return [];
    }
  }

  static async purchasePremium(): Promise<boolean> {
    try {
      await requestPurchase({ sku: PRODUCT_IDS[0] });
      return true;
    } catch (error) {
      console.warn('購入リクエストエラー:', error);
      return false;
    }
  }

  static cleanup() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
  }
}