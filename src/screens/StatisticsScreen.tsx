import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { AlcoholRecord, AlcoholCategory } from '../types';
import { StorageService } from '../services/storage';
import { StatisticsCard } from '../components/StatisticsCard';
import { CategoryChart } from '../components/CategoryChart';
import { RatingChart } from '../components/RatingChart';

interface StatisticsScreenProps {
  onClose: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ onClose }) => {
  const [records, setRecords] = useState<AlcoholRecord[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const allRecords = await StorageService.getAllRecords();
    setRecords(allRecords);
  };

  const getFilteredRecords = () => {
    const now = new Date();
    
    if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return records.filter(record => record.date >= weekAgo);
    } else if (selectedPeriod === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return records.filter(record => record.date >= monthAgo);
    }
    
    return records;
  };

  const filteredRecords = getFilteredRecords();

  const getCategoryData = () => {
    const categoryCount: Record<AlcoholCategory, number> = {
      [AlcoholCategory.BEER]: 0,
      [AlcoholCategory.SAKE]: 0,
      [AlcoholCategory.WINE_RED]: 0,
      [AlcoholCategory.WINE_WHITE]: 0,
      [AlcoholCategory.WHISKEY]: 0,
      [AlcoholCategory.SHOCHU]: 0,
      [AlcoholCategory.COCKTAIL]: 0,
      [AlcoholCategory.OTHER]: 0,
    };

    filteredRecords.forEach(record => {
      categoryCount[record.category]++;
    });

    const total = filteredRecords.length;
    return Object.entries(categoryCount)
      .filter(([, count]) => count > 0)
      .map(([category, count]) => ({
        category: category as AlcoholCategory,
        count,
        percentage: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getRatingData = () => {
    const ratingCount: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    filteredRecords.forEach(record => {
      ratingCount[record.rating]++;
    });

    const total = filteredRecords.length;
    const averageRating = total > 0 
      ? filteredRecords.reduce((sum, record) => sum + record.rating, 0) / total 
      : 0;

    const data = Object.entries(ratingCount)
      .map(([rating, count]) => ({
        rating: parseInt(rating),
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .reverse();

    return { data, averageRating };
  };

  const getMostFrequentCategory = () => {
    const categoryData = getCategoryData();
    return categoryData.length > 0 ? categoryData[0].category : '-';
  };

  const getHighestRatedDrink = () => {
    if (filteredRecords.length === 0) return '-';
    
    const highestRated = filteredRecords.reduce((max, record) => 
      record.rating > max.rating ? record : max
    );
    
    return highestRated.name;
  };

  const categoryData = getCategoryData();
  const { data: ratingData, averageRating } = getRatingData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.headerButton}>閉じる</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>統計</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.periodSelector}>
        {(['all', 'month', 'week'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period && styles.periodTextActive
            ]}>
              {period === 'all' ? '全期間' : period === 'month' ? '1ヶ月' : '1週間'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatisticsCard
            title="総記録数"
            value={filteredRecords.length}
            subtitle="回"
          />
          <StatisticsCard
            title="平均評価"
            value={averageRating.toFixed(1)}
            subtitle="★"
            color={COLORS.rating}
          />
          <StatisticsCard
            title="最多カテゴリ"
            value={getMostFrequentCategory()}
            color={COLORS.secondary}
          />
        </View>

        <StatisticsCard
          title="最高評価"
          value={getHighestRatedDrink()}
          color={COLORS.success}
        />

        {categoryData.length > 0 && <CategoryChart data={categoryData} />}
        
        {filteredRecords.length > 0 && (
          <RatingChart data={ratingData} averageRating={averageRating} />
        )}

        {filteredRecords.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>選択した期間にデータがありません</Text>
          </View>
        )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerButton: {
    fontSize: 16,
    color: COLORS.primary,
  },
  placeholder: {
    width: 40,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    fontSize: 14,
    color: COLORS.text,
  },
  periodTextActive: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  bottomSpace: {
    height: 50,
  },
});