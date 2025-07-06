import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants';

interface ErrorTextProps {
  error?: string;
}

export const ErrorText: React.FC<ErrorTextProps> = ({ error }) => {
  if (!error) return null;

  return <Text style={styles.errorText}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});