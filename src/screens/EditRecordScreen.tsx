import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { AlcoholCategory, AlcoholRecord } from '../types';
import { StorageService } from '../services/storage';
import { DatePicker } from '../components/DatePicker';
import { validateRecord } from '../validation/recordSchema';
import { ErrorText } from '../components/ErrorText';

interface EditRecordScreenProps {
  record: AlcoholRecord;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export const EditRecordScreen: React.FC<EditRecordScreenProps> = ({ 
  record, 
  onClose, 
  onSave, 
  onDelete 
}) => {
  const [date, setDate] = useState(record.date);
  const [category, setCategory] = useState(record.category);
  const [name, setName] = useState(record.name);
  const [rating, setRating] = useState(record.rating);
  const [store, setStore] = useState(record.store || '');
  const [memo, setMemo] = useState(record.memo || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteButtonScale] = useState(new Animated.Value(1));
  const [saveButtonScale] = useState(new Animated.Value(1));

  const categories = Object.values(AlcoholCategory);

  const handleSave = async () => {
    const formData = {
      date,
      category,
      name: name.trim(),
      rating,
      store: store.trim() || undefined,
      memo: memo.trim() || undefined,
    };

    const validation = validateRecord(formData);
    
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          newErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const updatedRecord: AlcoholRecord = {
      ...record,
      date,
      category,
      name: name.trim(),
      rating,
      store: store.trim() || undefined,
      memo: memo.trim() || undefined,
      updatedAt: new Date(),
    };

    try {
      await StorageService.saveRecord(updatedRecord);
      onSave();
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('この記録を削除しますか？');
      if (confirmed) {
        performDelete();
      }
    } else {
      Alert.alert(
        '削除確認',
        'この記録を削除しますか？',
        [
          { text: 'キャンセル', style: 'cancel' },
          { 
            text: '削除', 
            style: 'destructive',
            onPress: performDelete
          }
        ]
      );
    }
  };

  const performDelete = async () => {
    try {
      await StorageService.deleteRecord(record.id);
      onDelete();
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('削除に失敗しました');
      } else {
        Alert.alert('エラー', '削除に失敗しました');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.headerButton}>キャンセル</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>記録を編集</Text>
        <View />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <DatePicker
            selectedDate={date}
            onDateChange={setDate}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>カテゴリ</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>お酒の名前 *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors(prev => ({ ...prev, name: '' }));
              }
            }}
            placeholder="例: アサヒスーパードライ"
            placeholderTextColor={COLORS.textSecondary}
          />
          <ErrorText error={errors.name} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>評価</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star as 1 | 2 | 3 | 4 | 5)}
              >
                <Text style={[
                  styles.star,
                  star <= rating && styles.starActive
                ]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>店舗（任意）</Text>
          <TextInput
            style={[styles.input, errors.store && styles.inputError]}
            value={store}
            onChangeText={(text) => {
              setStore(text);
              if (errors.store) {
                setErrors(prev => ({ ...prev, store: '' }));
              }
            }}
            placeholder="例: セブンイレブン"
            placeholderTextColor={COLORS.textSecondary}
          />
          <ErrorText error={errors.store} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>メモ（任意）</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.memo && styles.inputError]}
            value={memo}
            onChangeText={(text) => {
              setMemo(text);
              if (errors.memo) {
                setErrors(prev => ({ ...prev, memo: '' }));
              }
            }}
            placeholder="味の感想など..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
          />
          <ErrorText error={errors.memo} />
        </View>


        <View style={styles.bottomSpace} />
      </ScrollView>
      
      <View style={styles.bottomActions}>
        <Animated.View style={{ flex: 1, transform: [{ scale: deleteButtonScale }] }}>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => {
              Animated.sequence([
                Animated.timing(deleteButtonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
                Animated.timing(deleteButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
              ]).start();
              setTimeout(handleDelete, 150);
            }}
          >
            <Text style={styles.deleteButtonText}>削除</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ flex: 1, transform: [{ scale: saveButtonScale }] }}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={() => {
              Animated.sequence([
                Animated.timing(saveButtonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
                Animated.timing(saveButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
              ]).start();
              setTimeout(handleSave, 100);
            }}
          >
            <Text style={styles.saveButtonText}>保存</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
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
    color: COLORS.textSecondary,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#DC3545',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  deleteButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  input: {
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    paddingVertical: SPACING.sm,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
  },
  categoryContainer: {
    marginHorizontal: -SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  categoryButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryTextActive: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  star: {
    fontSize: 32,
    color: COLORS.border,
  },
  starActive: {
    color: COLORS.rating,
  },
  bottomSpace: {
    height: 100,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
});