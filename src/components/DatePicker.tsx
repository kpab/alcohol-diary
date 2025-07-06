import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(selectedDate);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const handleDateSelect = () => {
    onDateChange(tempDate);
    setShowPicker(false);
  };

  const DatePickerCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(tempDate.getMonth());
    const [currentYear, setCurrentYear] = useState(tempDate.getFullYear());

    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
      return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // 空白の日
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 月の日付
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const dayNames = ['日','月','火','水','木','金','土'];

    const goToPreviousMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const goToNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const selectDate = (day: number) => {
      const newDate = new Date(currentYear, currentMonth, day);
      setTempDate(newDate);
    };

    const isSelectedDate = (day: number) => {
      return tempDate.getDate() === day && 
             tempDate.getMonth() === currentMonth && 
             tempDate.getFullYear() === currentYear;
    };

    const isToday = (day: number) => {
      const today = new Date();
      return today.getDate() === day && 
             today.getMonth() === currentMonth && 
             today.getFullYear() === currentYear;
    };

    return (
      <View style={pickerStyles.container}>
        <View style={pickerStyles.header}>
          <TouchableOpacity onPress={goToPreviousMonth} style={pickerStyles.navButton}>
            <Text style={pickerStyles.navButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={pickerStyles.monthTitle}>
            {currentYear}年 {monthNames[currentMonth]}
          </Text>
          
          <TouchableOpacity onPress={goToNextMonth} style={pickerStyles.navButton}>
            <Text style={pickerStyles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={pickerStyles.weekDays}>
          {dayNames.map(day => (
            <Text key={day} style={pickerStyles.weekDay}>{day}</Text>
          ))}
        </View>

        <View style={pickerStyles.daysGrid}>
          {days.map((day, index) => {
            if (!day) {
              return <View key={`empty-${index}`} style={pickerStyles.dayCell} />;
            }

            return (
              <TouchableOpacity
                key={day}
                style={[
                  pickerStyles.dayCell,
                  isSelectedDate(day) && pickerStyles.selectedDay,
                  isToday(day) && !isSelectedDate(day) && pickerStyles.todayDay
                ]}
                onPress={() => selectDate(day)}
              >
                <Text style={[
                  pickerStyles.dayText,
                  isSelectedDate(day) && pickerStyles.selectedDayText,
                  isToday(day) && !isSelectedDate(day) && pickerStyles.todayDayText
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={pickerStyles.buttonContainer}>
          <TouchableOpacity 
            style={[pickerStyles.button, pickerStyles.cancelButton]}
            onPress={() => setShowPicker(false)}
          >
            <Text style={pickerStyles.cancelButtonText}>キャンセル</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[pickerStyles.button, pickerStyles.confirmButton]}
            onPress={handleDateSelect}
          >
            <Text style={pickerStyles.confirmButtonText}>決定</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setShowPicker(true)}>
        <Text style={styles.label}>日付</Text>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <DatePickerCalendar />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    margin: SPACING.md,
    maxWidth: 350,
    width: '90%',
  },
});

const pickerStyles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  navButtonText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.sm,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  selectedDay: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  todayDay: {
    backgroundColor: COLORS.secondary + '30',
    borderRadius: BORDER_RADIUS.full,
  },
  dayText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedDayText: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  todayDayText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.surface,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});