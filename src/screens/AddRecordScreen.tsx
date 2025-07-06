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
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { AlcoholCategory, AlcoholRecord } from '../types';
import { StorageService } from '../services/storage';
import { DatePicker } from '../components/DatePicker';
import { validateRecord } from '../validation/recordSchema';
import { ErrorText } from '../components/ErrorText';

interface AddRecordScreenProps {
  onClose: () => void;
  onSave: () => void;
}

export const AddRecordScreen: React.FC<AddRecordScreenProps> = ({ onClose, onSave }) => {
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<AlcoholCategory>(AlcoholCategory.BEER);
  const [name, setName] = useState('');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [store, setStore] = useState('');
  const [memo, setMemo] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    const newRecord: AlcoholRecord = {
      id: Date.now().toString(),
      date,
      category,
      name: name.trim(),
      rating,
      store: store.trim() || undefined,
      memo: memo.trim() || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await StorageService.saveRecord(newRecord);
      onSave();
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
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
        <Text style={styles.headerTitle}>記録を追加</Text>
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
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    ...SHADOWS.subtle,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  headerButton: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
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
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.border,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButtonText: {
    color: COLORS.secondary,
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.card,
  },
  label: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: SPACING.md,
    fontWeight: '600',
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