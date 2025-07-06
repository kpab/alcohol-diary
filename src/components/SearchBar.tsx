import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'お酒の名前で検索...'
}) => {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        style={styles.searchbar}
        inputStyle={styles.input}
        iconColor={COLORS.textSecondary}
        placeholderTextColor={COLORS.textSecondary}
        theme={{
          colors: {
            primary: COLORS.primary,
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchbar: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    elevation: 0,
    height: 44,
  },
  input: {
    fontSize: 14,
    paddingVertical: 0,
  },
});