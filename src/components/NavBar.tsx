import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  label?: string;
  onBack: () => void;
}

const NavBar: React.FC<Props> = ({ label = ' Всі знаки', onBack }) => (
  <View style={styles.navBar}>
    <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
      <Text style={styles.backArrow}>‹</Text>
      <Text style={styles.backLabel}>{label}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: '#3B7FF5',
    lineHeight: 32,
    fontWeight: '300',
  },
  backLabel: {
    fontSize: 16,
    color: '#3B7FF5',
    fontWeight: '500',
  },
});

export default NavBar;
