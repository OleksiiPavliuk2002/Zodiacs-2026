import React, { useEffect, useRef } from "react";
import {
    Animated,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/NavBar";
import TabBar, { Tab } from "../components/TabBar";
import { ZODIAC_DATA } from "../data/zodiacData";

const InfoCard: React.FC<{ icon: string; title: string; value: string }> = ({
  icon,
  title,
  value,
}) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoText}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

interface Props {
  signId: string;
  onBack: () => void;
  onTabChange?: (tab: Tab) => void;
}

const HoroscopeScreen: React.FC<Props> = ({ signId, onBack, onTabChange }) => {
  const [activeTab, setActiveTab] = React.useState<Tab>("horoscope");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const data = ZODIAC_DATA[signId] ?? ZODIAC_DATA["libra"];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: false,
      }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />
      <SafeAreaView style={styles.safe}>
        <NavBar onBack={onBack} />

        <Animated.ScrollView
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <Text style={styles.heroEmoji}>{data.emoji}</Text>
            <View style={styles.heroText}>
              <Text style={styles.heroSub}>Прогноз для знаку</Text>
              <Text style={styles.heroName}>{data.name}</Text>
            </View>
          </View>

          <Text style={styles.description}>{data.description}</Text>

          <View style={styles.quoteBlock}>
            <Text style={styles.quoteText}>{data.quote}</Text>
          </View>

          <InfoCard
            icon={data.weapon.icon}
            title={data.weapon.title}
            value={data.weapon.value}
          />
          <InfoCard
            icon={data.horoscope.icon}
            title={data.horoscope.title}
            value={data.horoscope.value}
          />

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🍀</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Щасливі числа</Text>
              <View style={styles.numbersRow}>
                {data.luckyNumbers.map((n) => (
                  <View key={n} style={styles.numberChip}>
                    <Text style={styles.numberText}>{n}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={{ height: 20 }} />
        </Animated.ScrollView>

        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F7FB" },
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12 },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  heroEmoji: { fontSize: 56 },
  heroText: { flex: 1 },
  heroSub: { fontSize: 13, color: "#8A95A3", marginBottom: 2 },
  heroName: { fontSize: 24, fontWeight: "700", color: "#0F1B2D" },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#2C3E50",
    marginBottom: 20,
  },
  quoteBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3B7FF5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  quoteText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F1B2D",
    lineHeight: 22,
    fontStyle: "italic",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  infoIcon: { fontSize: 26, marginTop: 2 },
  infoText: { flex: 1 },
  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F1B2D",
    marginBottom: 3,
  },
  infoValue: { fontSize: 13, color: "#5A6A7A", lineHeight: 19 },
  numbersRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  numberChip: {
    backgroundColor: "#EFF4FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  numberText: { fontSize: 14, fontWeight: "600", color: "#3B7FF5" },
});

export default HoroscopeScreen;
