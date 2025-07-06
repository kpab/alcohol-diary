import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';

interface RatingData {
  rating: number;
  count: number;
  percentage: number;
}

interface RatingChartProps {
  data: RatingData[];
  averageRating: number;
}

export const RatingChart: React.FC<RatingChartProps> = ({ data, averageRating }) => {
  const maxCount = Math.max(...data.map(item => item.count), 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>評価統計</Text>
        <View style={styles.averageContainer}>
          <Text style={styles.averageLabel}>平均評価</Text>
          <Text style={styles.averageValue}>
            {'★'.repeat(Math.floor(averageRating))}
            {averageRating % 1 >= 0.5 ? '☆' : ''}
          </Text>
          <Text style={styles.averageNumber}>{averageRating.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        {data.map((item) => (
          <View key={item.rating} style={styles.barContainer}>
            <View style={styles.ratingInfo}>
              <Text style={styles.stars}>{'★'.repeat(item.rating)}</Text>
              <Text style={styles.count}>{item.count}回</Text>
            </View>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: COLORS.rating,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  averageContainer: {
    alignItems: 'center',
  },
  averageLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  averageValue: {
    fontSize: 16,
    color: COLORS.rating,
    marginVertical: 2,
  },
  averageNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  chartContainer: {
    gap: SPACING.sm,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  ratingInfo: {
    width: 80,
  },
  stars: {
    fontSize: 14,
    color: COLORS.rating,
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