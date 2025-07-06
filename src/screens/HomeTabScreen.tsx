import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { AlcoholRecord, AlcoholCategory } from '../types';
import { StorageService } from '../services/storage';
import { AddRecordScreen } from './AddRecordScreen';
import { EditRecordScreen } from './EditRecordScreen';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { CalendarView } from '../components/CalendarView';
import { SegmentedButtons } from 'react-native-paper';
import { ScrollView } from 'react-native';

export const HomeTabScreen: React.FC = () => {
  const [records, setRecords] = useState<AlcoholRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AlcoholRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<AlcoholCategory[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

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

  const handleCategoryToggle = (category: AlcoholCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedRatings([]);
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    setViewMode('list');
  };

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      // 日付によるフィルタリング（カレンダーから選択された場合）
      if (selectedDate) {
        const recordDate = record.date.toISOString().split('T')[0];
        if (recordDate !== selectedDate) {
          return false;
        }
      }
      
      // 検索クエリによるフィルタリング
      if (searchQuery && !record.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // カテゴリによるフィルタリング
      if (selectedCategories.length > 0 && !selectedCategories.includes(record.category)) {
        return false;
      }
      
      // 評価によるフィルタリング
      if (selectedRatings.length > 0 && !selectedRatings.includes(record.rating)) {
        return false;
      }
      
      return true;
    });
  }, [records, searchQuery, selectedCategories, selectedRatings, selectedDate]);

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
      </View>

      <View style={styles.viewModeContainer}>
        <SegmentedButtons
          value={viewMode}
          onValueChange={value => setViewMode(value as 'list' | 'calendar')}
          buttons={[
            {
              value: 'list',
              label: 'リスト',
              icon: 'format-list-bulleted',
            },
            {
              value: 'calendar',
              label: 'カレンダー',
              icon: 'calendar',
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {viewMode === 'list' ? (
        <>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FilterChips
            selectedCategories={selectedCategories}
            selectedRatings={selectedRatings}
            onCategoryToggle={handleCategoryToggle}
            onRatingToggle={handleRatingToggle}
            onClearFilters={handleClearFilters}
          />

          {selectedDate && (
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateText}>
                {new Date(selectedDate).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}の記録
              </Text>
              <TouchableOpacity onPress={() => setSelectedDate(undefined)}>
                <Text style={styles.clearDateText}>クリア</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={filteredRecords}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filteredRecords.length === 0 && records.length > 0
                ? '検索条件に一致する記録がありません'
                : 'まだ記録がありません'}
            </Text>
            <Text style={styles.emptySubText}>
              {filteredRecords.length === 0 && records.length > 0
                ? 'フィルターを変更してみてください'
                : '最初の記録を追加してみましょう'}
            </Text>
          </View>
        }
      />
        </>
      ) : (
        <ScrollView style={styles.calendarScrollView}>
          <CalendarView
            records={records}
            onDayPress={handleDayPress}
            selectedDate={selectedDate}
          />
        </ScrollView>
      )}

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.background,
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
    bottom: 100,
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
  viewModeContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  segmentedButtons: {
    backgroundColor: COLORS.surface,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.secondary + '20',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  selectedDateText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  clearDateText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  calendarScrollView: {
    flex: 1,
  },
});