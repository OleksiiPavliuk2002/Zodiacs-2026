import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMNS   = 3;
const CARD_GAP  = 12;
const PADDING_H = 20;
export const CARD_SIZE = (width - PADDING_H * 2 - CARD_GAP * (COLUMNS - 1)) / COLUMNS;

interface Props {
  emoji: string;
  name: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const ZodiacCard: React.FC<Props> = ({ emoji, name, selected, disabled = false, onPress }) => {
  const scale    = useRef(new Animated.Value(1)).current;
  const borderOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: selected ? 0.96 : 1,
        friction: 5,
        tension: 120,
        useNativeDriver: false,
      }),
      Animated.timing(borderOp, {
        toValue: selected ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  }, [selected, scale, borderOp]);

  const handlePress = () => {
    if (disabled) return;
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 80, useNativeDriver: false }),
      Animated.spring(scale, { toValue: selected ? 0.96 : 1, friction: 4, tension: 120, useNativeDriver: false }),
    ]).start();
    onPress();
  };

  const borderColor = borderOp.interpolate({
    inputRange:  [0, 1],
    outputRange: ['#FFFFFF', '#3B7FF5'],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1} disabled={disabled}>
      <Animated.View style={[
        styles.card,
        disabled && styles.cardDisabled,
        { transform: [{ scale }], borderColor, borderWidth: 2 },
      ]}>
        <Text style={[styles.emoji, disabled && { opacity: 0.35 }]}>{emoji}</Text>
        <Text style={[styles.name,  disabled && { opacity: 0.35 }]}>{name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardDisabled: { backgroundColor: '#F0F2F5' },
  emoji: { fontSize: 34, marginBottom: 6 },
  name: {
    fontSize: 11,
    fontWeight: '500',
    color: '#2C3E50',
    textAlign: 'center',
  },
});

export default ZodiacCard;
