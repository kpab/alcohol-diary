import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { StorageService } from '../services/storage';
import { PurchaseService } from '../services/purchaseService';

export const SettingsScreen: React.FC = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPremiumStatus();
    PurchaseService.initialize();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const status = await StorageService.getPremiumStatus();
      setIsPremium(status);
    } catch (error) {
      console.error('プレミアム状態読み込みエラー:', error);
    }
  };

  const handlePurchasePremium = async () => {
    if (isPremium) {
      Alert.alert('情報', 'すでにプレミアム機能をご利用いただいています。');
      return;
    }

    setLoading(true);
    try {
      const products = await PurchaseService.getProducts();
      if (products.length === 0) {
        Alert.alert('エラー', '商品情報を取得できませんでした。');
        return;
      }

      const product = products[0];
      
      Alert.alert(
        'プレミアム機能',
        `広告を非表示にしますか？\n価格: ${product.localizedPrice || '¥300'}`,
        [
          { text: 'キャンセル', style: 'cancel' },
          {
            text: '購入',
            onPress: async () => {
              const success = await PurchaseService.purchasePremium();
              if (success) {
                // 購入成功時の処理は PurchaseService のリスナーで行われる
                setTimeout(() => {
                  loadPremiumStatus();
                }, 1000);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('エラー', '購入処理でエラーが発生しました。');
      console.error('購入エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    // 購入復元機能（今回は簡易実装）
    Alert.alert('情報', '購入復元機能は今後のアップデートで対応予定です。');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>プレミアム機能</Text>
        
        {isPremium ? (
          <View style={styles.premiumStatus}>
            <Text style={styles.premiumText}>✓ プレミアム機能有効</Text>
            <Text style={styles.premiumDescription}>
              広告が非表示になっています
            </Text>
          </View>
        ) : (
          <View style={styles.premiumSection}>
            <Text style={styles.premiumDescription}>
              広告を非表示にして、より快適にアプリをご利用いただけます。
            </Text>
            <TouchableOpacity
              style={[styles.purchaseButton, loading && styles.purchaseButtonDisabled]}
              onPress={handlePurchasePremium}
              disabled={loading}
            >
              <Text style={styles.purchaseButtonText}>
                {loading ? '処理中...' : 'プレミアム機能を購入 (¥300)'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>その他</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleRestorePurchases}>
          <Text style={styles.settingText}>購入を復元</Text>
        </TouchableOpacity>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>バージョン</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>酒日記 - あなたのお酒記録アプリ</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  premiumStatus: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  premiumText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  premiumSection: {
    alignItems: 'center',
  },
  premiumDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  purchaseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 200,
    alignItems: 'center',
  },
  purchaseButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  purchaseButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingText: {
    fontSize: 16,
    color: COLORS.text,
  },
  settingValue: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});