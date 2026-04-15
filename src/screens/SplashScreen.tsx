import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const ORBIT_RADIUS = 118;
const ICON_SIZE = 52;
const ORBIT_DIAMETER = ORBIT_RADIUS * 2 + ICON_SIZE;

const ZODIAC_SIGNS = [
  { id: 1, emoji: "♈" },
  { id: 2, emoji: "♉" },
  { id: 3, emoji: "♊" },
  { id: 4, emoji: "♋" },
  { id: 5, emoji: "♌" },
  { id: 6, emoji: "♍" },
  { id: 7, emoji: "♎" },
  { id: 8, emoji: "♏" },
  { id: 9, emoji: "♐" },
  { id: 10, emoji: "♑" },
  { id: 11, emoji: "♒" },
  { id: 12, emoji: "♓" },
];

const STARS = [
  { top: height * 0.18, left: width * 0.1, size: 28 },
  { top: height * 0.14, right: width * 0.12, size: 22 },
  { top: height * 0.55, left: width * 0.05, size: 18 },
  { top: height * 0.62, right: width * 0.07, size: 24 },
];

const LoadingDots: React.FC = () => {
  const d1 = useRef(new Animated.Value(0.3)).current;
  const d2 = useRef(new Animated.Value(0.3)).current;
  const d3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    [d1, d2, d3].forEach((dot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, {
            toValue: 1,
            duration: 350,
            useNativeDriver: false,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 350,
            useNativeDriver: false,
          }),
          Animated.delay(Math.max(0, 600 - i * 200)),
        ]),
      ).start();
    });
  }, [d1, d2, d3]);

  return (
    <View style={styles.dotsRow}>
      {[d1, d2, d3].map((dot, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
      ))}
    </View>
  );
};

interface Props {
  onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const sunPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: false,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sunPulse, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(sunPulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
      ]),
    ).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => onFinish());
    }, 5000);

    return () => clearTimeout(timer);
  }, [fadeAnim, rotationAnim, scaleAnim, sunPulse, onFinish]);

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const counterRotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-360deg"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8EEF8" />
      <View style={styles.cloudBg} />

      {STARS.map((s, i) => (
        <View
          key={i}
          style={[
            styles.starWrapper,
            { top: s.top },
            s.left ? { left: s.left } : {},
            s.right ? { right: s.right } : {},
          ]}
        >
          <Text style={[styles.starText, { fontSize: s.size }]}>✦</Text>
        </View>
      ))}

      <Animated.View
        style={[styles.wheelContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        <Animated.View style={[styles.orbit, { transform: [{ rotate }] }]}>
          {ZODIAC_SIGNS.map((sign, index) => {
            const angle =
              (index / ZODIAC_SIGNS.length) * 2 * Math.PI - Math.PI / 2;
            const x = Math.cos(angle) * ORBIT_RADIUS;
            const y = Math.sin(angle) * ORBIT_RADIUS;
            return (
              <Animated.View
                key={sign.id}
                style={[
                  styles.iconWrapper,
                  {
                    left: ORBIT_RADIUS + x,
                    top: ORBIT_RADIUS + y,
                    transform: [{ rotate: counterRotate }],
                  },
                ]}
              >
                <Text style={styles.zodiacEmoji}>{sign.emoji}</Text>
              </Animated.View>
            );
          })}
        </Animated.View>
        <Animated.View
          style={[
            styles.sunContainer,
            { transform: [{ rotate }, { scale: sunPulse }] },
          ]}
        >
          <Text style={styles.sunEmoji}>☀️</Text>
        </Animated.View>
      </Animated.View>

      <Text style={styles.title}>Знаки Зодіаку 2026</Text>
      <LoadingDots />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EEF8",
    alignItems: "center",
    justifyContent: "center",
  },
  cloudBg: {
    position: "absolute",
    width: width * 1.15,
    height: height * 0.52,
    top: height * 0.22,
    backgroundColor: "#C8DCF0",
    borderRadius: width * 0.6,
    opacity: 0.4,
  },
  starWrapper: { position: "absolute" },
  starText: {
    color: "#F5C842",
    textShadowColor: "#D4A017",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  wheelContainer: {
    width: ORBIT_DIAMETER,
    height: ORBIT_DIAMETER,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
  },
  orbit: {
    position: "absolute",
    width: ORBIT_DIAMETER,
    height: ORBIT_DIAMETER,
    left: 0,
    top: 0,
  },
  iconWrapper: {
    position: "absolute",
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 4,
  },
  zodiacEmoji: { fontSize: 24 },
  sunContainer: {
    width: ORBIT_DIAMETER,
    height: ORBIT_DIAMETER,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    top: 0,
  },
  sunEmoji: { fontSize: 90 },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A2E",
    letterSpacing: 0.4,
  },
  dotsRow: { flexDirection: "row", marginTop: 18, gap: 7 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#F5C842" },
});

export default SplashScreen;
