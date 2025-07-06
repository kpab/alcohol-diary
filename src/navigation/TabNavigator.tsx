import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { HomeTabScreen } from '../screens/HomeTabScreen';
import { StatisticsTabScreen } from '../screens/StatisticsTabScreen';
import { SettingsTabScreen } from '../screens/SettingsTabScreen';

const RecordRoute = () => <HomeTabScreen />;
const StatsRoute = () => <StatisticsTabScreen />;
const SettingsRoute = () => <SettingsTabScreen />;

export const TabNavigator = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { 
      key: 'record', 
      title: '記録', 
      focusedIcon: 'plus-circle',
      unfocusedIcon: 'plus-circle-outline' 
    },
    { 
      key: 'stats', 
      title: '統計', 
      focusedIcon: 'chart-line',
      unfocusedIcon: 'chart-line-variant' 
    },
    { 
      key: 'settings', 
      title: '設定', 
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline' 
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    record: RecordRoute,
    stats: StatsRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor="#FF6B6B"
      inactiveColor="#7F8C8D"
      barStyle={{ 
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E9ECEF',
        borderTopWidth: 1,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      }}
    />
  );
};