import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from './src/constants';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>酒日記</Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 記録を追加</Text>
        </TouchableOpacity>
        
        <Text style={styles.emptyText}>まだ記録がありません</Text>
        <Text style={styles.emptySubText}>最初の記録を追加してみましょう</Text>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 30,
    marginBottom: SPACING.xl,
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
