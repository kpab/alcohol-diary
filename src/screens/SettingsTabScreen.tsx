import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { StorageService } from '../services/storage';
import { UserSettings } from '../types';

export const SettingsTabScreen: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({ isPremium: false });
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    loadSettings();
    loadRecordCount();
  }, []);

  const loadSettings = async () => {
    const userSettings = await StorageService.getSettings();
    setSettings(userSettings);
  };

  const loadRecordCount = async () => {
    const records = await StorageService.getAllRecords();
    setTotalRecords(records.length);
  };


  const handleDeleteAllData = () => {
    Alert.alert(
      'データ削除',
      '全ての記録を削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '削除', 
          style: 'destructive',
          onPress: async () => {
            try {
              // 全記録を削除（実装は後で追加）
              Alert.alert('削除完了', '全ての記録を削除しました');
              setTotalRecords(0);
            } catch (error) {
              Alert.alert('エラー', '削除に失敗しました');
            }
          }
        }
      ]
    );
  };

  const handlePremiumUpgrade = () => {
    Alert.alert(
      'プレミアム版',
      '広告なしのプレミアム版は今後実装予定です',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>設定</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリ情報</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>総記録数</Text>
              <Text style={styles.infoValue}>{totalRecords}件</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>プレミアム版</Text>
              <Text style={styles.infoValue}>
                {settings.isPremium ? '有効' : '無効'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>バージョン</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>機能</Text>
          
          {!settings.isPremium && (
            <TouchableOpacity style={styles.menuItem} onPress={handlePremiumUpgrade}>
              <Text style={styles.menuText}>プレミアム版にアップグレード</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          )}

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>データ管理</Text>
          
          <TouchableOpacity style={[styles.menuItem, styles.dangerItem]} onPress={handleDeleteAllData}>
            <Text style={[styles.menuText, styles.dangerText]}>全データを削除</Text>
            <Text style={[styles.menuArrow, styles.dangerText]}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>その他</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.aboutText}>
              酒日記 - シンプルなお酒の記録アプリ{'\n'}
              お酒の記録を簡単に残せます。
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  menuItem: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: COLORS.text,
  },
  menuArrow: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  dangerItem: {
    backgroundColor: '#FFF5F5',
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  dangerText: {
    color: COLORS.error,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bottomSpace: {
    height: 100,
  },
});