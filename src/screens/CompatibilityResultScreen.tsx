import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/NavBar";
import TabBar from "../components/TabBar";
import { getCompatibility, getScoreColor } from "../data/compatibilityData";
import { ZODIAC_DATA } from "../data/zodiacData";

const { width } = Dimensions.get("window");

interface Props {
  mySignId: string;
  partnerSignId: string;
  onBack: () => void;
  onTabChange?: (tab: "horoscope" | "compatibility") => void;
}

const CompatibilityResultScreen: React.FC<Props> = ({
  mySignId,
  partnerSignId,
  onBack,
  onTabChange,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  const mySign = ZODIAC_DATA[mySignId];
  const partnerSign = ZODIAC_DATA[partnerSignId];
  const compat = getCompatibility(mySignId, partnerSignId);
  const scoreColor = getScoreColor(compat.score);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: false,
      }),
    ]).start();
    Animated.timing(scoreAnim, {
      toValue: compat.score,
      duration: 900,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, slideAnim, scoreAnim, compat.score]);

  const scoreDisplay = scoreAnim.interpolate({
    inputRange: Array.from({ length: 11 }, (_, i) => i),
    outputRange: Array.from({ length: 11 }, (_, i) => `${i}`),
  });

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
          <View style={styles.signCard}>
            <Text style={styles.signEmoji}>{mySign?.emoji ?? "🔮"}</Text>
            <View style={styles.signTextCol}>
              <Text style={styles.signSub}>Сумісність для знаку</Text>
              <Text style={styles.signName}>{mySign?.name ?? ""}</Text>
            </View>
          </View>
          <View style={[styles.signCard, { marginTop: 10 }]}>
            <Text style={styles.signEmoji}>{partnerSign?.emoji ?? "🔮"}</Text>
            <View style={styles.signTextCol}>
              <Text style={styles.signSub}>Сумісність зі знаком</Text>
              <Text style={styles.signName}>{partnerSign?.name ?? ""}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.scoreBlock}>
            <Text style={styles.scoreTitle}>Ваша сумісність</Text>
            <Animated.Text style={[styles.scoreNumber, { color: scoreColor }]}>
              {scoreDisplay}
            </Animated.Text>
            <View style={styles.scoreBarTrack}>
              <Animated.View
                style={[
                  styles.scoreBarFill,
                  {
                    backgroundColor: scoreColor,
                    width: scoreAnim.interpolate({
                      inputRange: [0, 10],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={[styles.scoreLabel, { color: scoreColor }]}>
              {compat.label}
            </Text>
          </View>

          <View style={styles.descCard}>
            <Text style={styles.descText}>{compat.description}</Text>
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Порада</Text>
            <Text style={styles.tipsText}>
              {compat.score >= 8
                ? "Ви створені одне для одного. Не зупиняйтеся — розвивайте те, що у вас є!"
                : compat.score >= 6
                  ? "У вас є потенціал. Відкритість та спілкування — ваші найкращі інструменти."
                  : compat.score >= 4
                    ? "Попереду є виклики, але кожна перешкода — це можливість стати ближчими."
                    : "Зірки дають вам шанс на унікальний досвід. Навчайтеся одне в одного."}
            </Text>
          </View>
          <View style={{ height: 32 }} />
        </Animated.ScrollView>

        <TabBar
          activeTab="compatibility"
          onTabChange={(tab) => onTabChange?.(tab)}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F7FB" },
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  signCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  signEmoji: { fontSize: 52 },
  signTextCol: { flex: 1 },
  signSub: { fontSize: 12, color: "#8A95A3", marginBottom: 3 },
  signName: { fontSize: 22, fontWeight: "700", color: "#0F1B2D" },
  divider: {
    height: 1,
    backgroundColor: "#E4EAF4",
    marginVertical: 20,
    marginHorizontal: 8,
  },
  scoreBlock: { alignItems: "center", marginBottom: 24 },
  scoreTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F1B2D",
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: "800",
    lineHeight: 80,
    marginBottom: 12,
  },
  scoreBarTrack: {
    width: width - 80,
    height: 8,
    backgroundColor: "#E4EAF4",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  scoreBarFill: { height: "100%", borderRadius: 4 },
  scoreLabel: { fontSize: 15, fontWeight: "600", letterSpacing: 0.2 },
  descCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  descText: { fontSize: 15, lineHeight: 24, color: "#2C3E50" },
  tipsCard: {
    backgroundColor: "#EFF4FF",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3B7FF5",
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F1B2D",
    marginBottom: 6,
  },
  tipsText: { fontSize: 14, lineHeight: 22, color: "#2C3E50" },
});

export default CompatibilityResultScreen;
