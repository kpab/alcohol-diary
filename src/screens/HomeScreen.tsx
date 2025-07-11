import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { AlcoholRecord } from '../types';
import { StorageService } from '../services/storage';
import { AddRecordScreen } from './AddRecordScreen';
import { EditRecordScreen } from './EditRecordScreen';
import { StatisticsScreen } from './StatisticsScreen';

export const HomeScreen: React.FC = () => {
  const [records, setRecords] = useState<AlcoholRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AlcoholRecord | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const loadedRecords = await StorageService.getAllRecords();
    setRecords(loadedRecords.sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  const handleAddRecord = () => {
    setShowAddModal(true);
  };

  const handleSaveRecord = () => {
    setShowAddModal(false);
    loadRecords();
  };

  const handleEditRecord = (record: AlcoholRecord) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  const handleUpdateRecord = () => {
    setShowEditModal(false);
    setSelectedRecord(null);
    loadRecords();
  };

  const handleDeleteRecord = () => {
    setShowEditModal(false);
    setSelectedRecord(null);
    loadRecords();
  };

  const renderRecord = ({ item }: { item: AlcoholRecord }) => (
    <TouchableOpacity style={styles.recordCard} onPress={() => handleEditRecord(item)}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordDate}>
          {item.date.toLocaleDateString('ja-JP', { 
            month: 'numeric', 
            day: 'numeric' 
          })}
        </Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      
      <Text style={styles.recordName}>{item.name}</Text>
      
      <View style={styles.recordFooter}>
        <Text style={styles.rating}>{'★'.repeat(item.rating)}</Text>
        {item.store && <Text style={styles.store}>{item.store}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>酒日記</Text>
        <TouchableOpacity 
          style={styles.statsButton}
          onPress={() => setShowStatsModal(true)}
        >
          <Text style={styles.statsButtonText}>統計</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={records}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>まだ記録がありません</Text>
            <Text style={styles.emptySubText}>最初の記録を追加してみましょう</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddRecord}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AddRecordScreen
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveRecord}
        />
      </Modal>

      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedRecord && (
          <EditRecordScreen
            record={selectedRecord}
            onClose={() => setShowEditModal(false)}
            onSave={handleUpdateRecord}
            onDelete={handleDeleteRecord}
          />
        )}
      </Modal>

      <Modal
        visible={showStatsModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <StatisticsScreen onClose={() => setShowStatsModal(false)} />
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  statsButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.full,
  },
  statsButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContent: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  recordCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  recordDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.background,
  },
  recordName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    color: COLORS.rating,
    fontSize: 16,
  },
  store: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
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
  fab: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
    color: COLORS.background,
  },
});