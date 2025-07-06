import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { AlcoholCategory } from '../types';

interface CategoryData {
  category: AlcoholCategory;
  count: number;
  percentage: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(item => item.count), 1);
  
  const categoryColors: Record<AlcoholCategory, string> = {
    [AlcoholCategory.BEER]: '#FFA500',
    [AlcoholCategory.SAKE]: '#E6E6FA',
    [AlcoholCategory.WINE_RED]: '#8B0000',
    [AlcoholCategory.WINE_WHITE]: '#F5F5DC',
    [AlcoholCategory.WHISKEY]: '#D2691E',
    [AlcoholCategory.SHOCHU]: '#98FB98',
    [AlcoholCategory.COCKTAIL]: '#FF69B4',
    [AlcoholCategory.OTHER]: '#C0C0C0',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>カテゴリ別統計</Text>
      <View style={styles.chartContainer}>
        {data.map((item) => (
          <View key={item.category} style={styles.barContainer}>
            <View style={styles.barInfo}>
              <Text style={styles.categoryName}>{item.category}</Text>
              <Text style={styles.count}>{item.count}回</Text>
            </View>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: categoryColors[item.category],
                  },
                ]}
              />
            </View>
            <Text style={styles.percentage}>{item.percentage.toFixed(1)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  chartContainer: {
    gap: SPACING.sm,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  barInfo: {
    width: 80,
  },
  categoryName: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  barWrapper: {
    flex: 1,
    height: 20,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  percentage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 40,
    textAlign: 'right',
  },
});