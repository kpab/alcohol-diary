import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants';
import { AlcoholRecord, AlcoholCategory } from '../types';
import { StorageService } from '../services/storage';
import { AddRecordScreen } from './AddRecordScreen';
import { EditRecordScreen } from './EditRecordScreen';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { CalendarView } from '../components/CalendarView';
import { BannerAd } from '../components/BannerAd';
import { AdService } from '../services/adService';
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
  const [isPremium, setIsPremium] = useState(false);
  const [fabScale] = useState(new Animated.Value(1));

  useEffect(() => {
    loadRecords();
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    const status = await StorageService.getPremiumStatus();
    setIsPremium(status);
  };

  const loadRecords = async () => {
    const loadedRecords = await StorageService.getAllRecords();
    setRecords(loadedRecords.sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  const handleAddRecord = () => {
    // FAB アニメーション
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setShowAddModal(true);
  };

  const handleSaveRecord = async () => {
    setShowAddModal(false);
    loadRecords();
    
    // プレミアムでない場合、インタースティシャル広告を表示する可能性
    if (!isPremium) {
      await AdService.maybeShowInterstitialAd();
    }
  };

  const handleEditRecord = (record: AlcoholRecord) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  const handleUpdateRecord = async () => {
    setShowEditModal(false);
    setSelectedRecord(null);
    loadRecords();
    
    // プレミアムでない場合、インタースティシャル広告を表示する可能性
    if (!isPremium) {
      await AdService.maybeShowInterstitialAd();
    }
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

  const RecordCard = ({ item }: { item: AlcoholRecord }) => {
    const [cardScale] = useState(new Animated.Value(1));
    
    const animateCard = () => {
      Animated.sequence([
        Animated.timing(cardScale, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
        <TouchableOpacity 
          style={styles.recordCard} 
          onPress={() => {
            animateCard();
            setTimeout(() => handleEditRecord(item), 150);
          }}
        >
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
      </Animated.View>
    );
  };

  const renderRecord = ({ item }: { item: AlcoholRecord }) => (
    <RecordCard item={item} />
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

      {!isPremium && <BannerAd />}

      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity style={styles.fabButton} onPress={handleAddRecord}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Animated.View>

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
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.card,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  recordDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryText: {
    fontSize: 11,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  recordName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    letterSpacing: -0.3,
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
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '400',
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
    right: SPACING.lg,
    bottom: 120,
    width: 56,
    height: 56,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.elevated,
  },
  fabText: {
    fontSize: 22,
    color: COLORS.surface,
    fontWeight: '600',
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