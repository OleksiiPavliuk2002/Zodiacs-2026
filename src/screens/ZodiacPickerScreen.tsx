import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ZodiacCard from "../components/ZodiacCard";
import { ALL_SIGNS } from "../data/zodiacData";

const CARD_GAP = 12;

interface Props {
  onContinue: (signId: string) => void;
}

const ZodiacPickerScreen: React.FC<Props> = ({ onContinue }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const btnTranslateY = useRef(new Animated.Value(80)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
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
        <Text style={styles.header}>Обери свій знак зодіаку</Text>

        <FlatList
          data={ALL_SIGNS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ZodiacCard
              emoji={item.emoji}
              name={item.name}
              selected={selectedId === item.id}
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
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F7FB" },
  safe: { flex: 1 },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F1B2D",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 18,
    letterSpacing: 0.2,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 24, gap: CARD_GAP },
  row: { gap: CARD_GAP, justifyContent: "flex-start" },
  btnWrapper: { paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8 },
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

export default ZodiacPickerScreen;
