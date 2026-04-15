import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/NavBar";
import TabBar from "../components/TabBar";
import ZodiacCard from "../components/ZodiacCard";
import { ALL_SIGNS, ZODIAC_DATA } from "../data/zodiacData";

const CARD_GAP = 12;

interface Props {
  mySignId: string;
  onBack: () => void;
  onContinue: (partnerSignId: string) => void;
}

const CompatibilityScreen: React.FC<Props> = ({
  mySignId,
  onBack,
  onContinue,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const btnTranslateY = useRef(new Animated.Value(80)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mySign = ZODIAC_DATA[mySignId];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 380,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim]);

  const showButton = (show: boolean) => {
    Animated.parallel([
      Animated.spring(btnTranslateY, {
        toValue: show ? 0 : 80,
        friction: 7,
        tension: 80,
        useNativeDriver: false,
      }),
      Animated.timing(btnOpacity, {
        toValue: show ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleSelect = (id: string) => {
    if (id === selectedId) {
      setSelectedId(null);
      showButton(false);
    } else {
      setSelectedId(id);
      showButton(true);
    }
  };

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />
      <SafeAreaView style={styles.safe}>
        <NavBar onBack={onBack} />

        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{mySign?.emoji ?? "🔮"}</Text>
          <View>
            <Text style={styles.heroSub}>Сумісність для знаку</Text>
            <Text style={styles.heroName}>{mySign?.name ?? ""}</Text>
          </View>
        </View>

        <FlatList
          data={ALL_SIGNS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ZodiacCard
              emoji={item.emoji}
              name={item.name}
              selected={selectedId === item.id}
              disabled={item.id === mySignId}
              onPress={() => handleSelect(item.id)}
            />
          )}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <Animated.View
          style={[
            styles.btnWrapper,
            { opacity: btnOpacity, transform: [{ translateY: btnTranslateY }] },
          ]}
          pointerEvents={selectedId ? "auto" : "none"}
        >
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.85}
            onPress={() => selectedId && onContinue(selectedId)}
          >
            <Text style={styles.btnText}>Продовжити</Text>
          </TouchableOpacity>
        </Animated.View>

        <TabBar
          activeTab="compatibility"
          onTabChange={(tab) => {
            if (tab === "horoscope") onBack();
          }}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F7FB" },
  safe: { flex: 1 },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  heroEmoji: { fontSize: 52 },
  heroSub: { fontSize: 13, color: "#8A95A3", marginBottom: 2 },
  heroName: { fontSize: 22, fontWeight: "700", color: "#0F1B2D" },
  listContent: { paddingHorizontal: 20, paddingBottom: 16, gap: CARD_GAP },
  row: { gap: CARD_GAP, justifyContent: "flex-start" },
  btnWrapper: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8 },
  btn: {
    backgroundColor: "#3B7FF5",
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: "#3B7FF5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default CompatibilityScreen;
