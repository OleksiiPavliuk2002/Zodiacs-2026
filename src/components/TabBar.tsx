import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type Tab = 'horoscope' | 'compatibility';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'horoscope',     label: 'Гороскоп',  icon: '🔮' },
  { id: 'compatibility', label: 'Сумісність', icon: '💛' },
];

const TabBar: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <View style={styles.tabBar}>
    {TABS.map(tab => {
      const active = activeTab === tab.id;
      return (
        <TouchableOpacity
          key={tab.id}
          style={styles.tabItem}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.7}>
          <Text style={[styles.tabIcon, active && styles.tabIconActive]}>
            {tab.icon}
          </Text>
          <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
            {tab.label}
          </Text>
          {active && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E8ECF4',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 3,
    opacity: 0.45,
  },
  tabIconActive: { opacity: 1 },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8A95A3',
  },
  tabLabelActive: {
    color: '#3B7FF5',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 2.5,
    backgroundColor: '#3B7FF5',
    borderRadius: 2,
  },
});

export default TabBar;
