import React, { useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const slides = [
  { key: "1", emoji: "🌱", title: "Welcome To Sprout", body: "Your all-in-one platform for seamless plant care." },
  { key: "2", emoji: "💧", title: "Never Forget To Water", body: "Powerful reminders that revolutionize your routine." },
  { key: "3", emoji: "🚀", title: "Grow Like A Pro", body: "Unleash the power of AI-driven plant insights." },
];

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  return (
    <LinearGradient colors={["#7c3aed", "#4f46e5", "#2563eb"]} style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={() => navigation.replace("Home")}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />
      <View style={styles.dots}>
        {slides.map((s, i) => (
          <View key={s.key} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => (index < 2 ? ref.current?.scrollToIndex({ index: index + 1 }) : navigation.replace("Home"))}
      >
        <Text style={styles.buttonText}>{index < 2 ? "Next →" : "Get Started ✨"}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  skip: { alignSelf: "flex-end", padding: 16 },
  skipText: { color: "rgba(255,255,255,0.7)", fontFamily: "Inter" },
  slide: { alignItems: "center", justifyContent: "center", padding: 32 },
  emoji: { fontSize: 96 },
  title: { fontSize: 32, fontWeight: "800", color: "#fff", textAlign: "center", marginTop: 24, fontFamily: "Inter" },
  body: { fontSize: 16, color: "rgba(255,255,255,0.8)", textAlign: "center", marginTop: 12 },
  dots: { flexDirection: "row", justifyContent: "center", marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.4)", marginHorizontal: 4 },
  dotActive: { width: 24, backgroundColor: "#fff" },
  button: { marginHorizontal: 24, marginBottom: 48, backgroundColor: "#fff", paddingVertical: 18, borderRadius: 24, alignItems: "center", shadowColor: "#7c3aed", shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  buttonText: { color: "#7c3aed", fontSize: 18, fontWeight: "700" },
});
