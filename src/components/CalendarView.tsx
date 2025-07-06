import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { AlcoholRecord } from '../types';

// react-native-calendarsはWebで動作しないため、シンプルなカレンダーを実装
const Calendar = ({ onDayPress, markedDates, theme, style }: any) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
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
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  return (
    <View style={[styles.calendarContainer, style]}>
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToToday} style={styles.monthTitleButton}>
          <Text style={styles.monthTitle}>{currentYear}年 {monthNames[currentMonth]}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>→</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekDays}>
        {dayNames.map(day => (
          <Text key={day} style={styles.weekDay}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }
          
          const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const marked = markedDates[dateString];
          
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayCell,
                marked?.selected && styles.selectedDay
              ]}
              onPress={() => onDayPress({ dateString })}
            >
              <Text style={[
                styles.dayText,
                marked?.selected && styles.selectedDayText
              ]}>
                {day}
              </Text>
              {marked?.dots && (
                <View style={styles.dotsContainer}>
                  {marked.dots.slice(0, 3).map((dot: any, i: number) => (
                    <View
                      key={i}
                      style={[styles.dot, { backgroundColor: dot.color }]}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

interface CalendarViewProps {
  records: AlcoholRecord[];
  onDayPress: (date: string) => void;
  selectedDate?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  records, 
  onDayPress,
  selectedDate 
}) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'ビール': '#FFA500',
      '日本酒': '#E6E6FA',
      '赤ワイン': '#8B0000',
      '白ワイン': '#F5F5DC',
      'ウイスキー': '#D2691E',
      '焼酎': '#98FB98',
      'カクテル': '#FF69B4',
      'その他': '#C0C0C0',
    };
    return colors[category] || COLORS.primary;
  };

  const markedDates = useMemo(() => {
    const marks: any = {};
    
    // 記録がある日付をマーク
    records.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      if (!marks[dateStr]) {
        marks[dateStr] = {
          dots: [],
          marked: true
        };
      }
      
      // カテゴリごとに色を変える（最大3つまで表示）
      if (marks[dateStr].dots.length < 3) {
        marks[dateStr].dots.push({
          color: getCategoryColor(record.category),
          selectedDotColor: getCategoryColor(record.category)
        });
      }
    });
    
    // 選択された日付をハイライト
    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: COLORS.primary
      };
    }
    
    return marks;
  }, [records, selectedDate]);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: any) => onDayPress(day.dateString)}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          backgroundColor: COLORS.background,
          calendarBackground: COLORS.background,
          textSectionTitleColor: COLORS.text,
          selectedDayBackgroundColor: COLORS.primary,
          selectedDayTextColor: COLORS.background,
          todayTextColor: COLORS.primary,
          dayTextColor: COLORS.text,
          textDisabledColor: COLORS.textSecondary,
          dotColor: COLORS.primary,
          selectedDotColor: COLORS.background,
          arrowColor: COLORS.primary,
          monthTextColor: COLORS.text,
          indicatorColor: COLORS.primary,
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
      />
      
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>カテゴリ別の記録</Text>
        <View style={styles.legendItems}>
          {Object.entries({
            'ビール': '#FFA500',
            '日本酒': '#E6E6FA',
            'ワイン': '#8B0000',
            'その他': '#C0C0C0',
          }).map(([category, color]) => (
            <View key={category} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  monthButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  monthButtonText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  monthTitleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  monthTitle: {
    fontSize: 20,
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
  dayText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedDayText: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  calendar: {
    borderRadius: BORDER_RADIUS.md,
  },
  legend: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});