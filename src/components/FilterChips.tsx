import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Chip } from 'react-native-paper';
import { COLORS, SPACING } from '../constants';
import { AlcoholCategory } from '../types';

interface FilterChipsProps {
  selectedCategories: AlcoholCategory[];
  selectedRatings: number[];
  onCategoryToggle: (category: AlcoholCategory) => void;
  onRatingToggle: (rating: number) => void;
  onClearFilters: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedCategories,
  selectedRatings,
  onCategoryToggle,
  onRatingToggle,
  onClearFilters,
}) => {
  const categories = Object.values(AlcoholCategory);
  const ratings = [5, 4, 3, 2, 1];
  const hasFilters = selectedCategories.length > 0 || selectedRatings.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hasFilters && (
          <Chip
            mode="outlined"
            onPress={onClearFilters}
            style={[styles.chip, styles.clearChip]}
            textStyle={styles.clearChipText}
            icon="close-circle"
          >
            クリア
          </Chip>
        )}

        {categories.map((category) => (
          <Chip
            key={category}
            mode={selectedCategories.includes(category) ? 'flat' : 'outlined'}
            selected={selectedCategories.includes(category)}
            onPress={() => onCategoryToggle(category)}
            style={[
              styles.chip,
              selectedCategories.includes(category) && styles.selectedChip
            ]}
            textStyle={[
              styles.chipText,
              selectedCategories.includes(category) && styles.selectedChipText
            ]}
          >
            {category}
          </Chip>
        ))}

        <View style={styles.divider} />

        {ratings.map((rating) => (
          <Chip
            key={`rating-${rating}`}
            mode={selectedRatings.includes(rating) ? 'flat' : 'outlined'}
            selected={selectedRatings.includes(rating)}
            onPress={() => onRatingToggle(rating)}
            style={[
              styles.chip,
              selectedRatings.includes(rating) && styles.selectedChip
            ]}
            textStyle={[
              styles.chipText,
              selectedRatings.includes(rating) && styles.selectedChipText
            ]}
            icon={() => (
              <View style={styles.ratingIcon}>
                {[...Array(rating)].map((_, i) => (
                  <span key={i} style={{ color: COLORS.rating, fontSize: 12 }}>★</span>
                ))}
              </View>
            )}
          >
            {rating}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  chip: {
    marginRight: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedChipText: {
    color: COLORS.background,
  },
  clearChip: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  clearChipText: {
    color: COLORS.background,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.sm,
  },
  ratingIcon: {
    flexDirection: 'row',
  },
});