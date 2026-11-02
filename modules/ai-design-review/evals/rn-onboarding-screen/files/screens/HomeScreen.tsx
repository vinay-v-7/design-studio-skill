import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Plant = { id: string; name: string; nextWater: string; status: "ok" | "thirsty" };

export default function HomeScreen({ plants }: { plants: Plant[] }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#8b5cf6", "#6366f1"]} style={styles.header}>
        <Text style={styles.greeting}>Welcome Back, Alex! 👋</Text>
        <Text style={styles.sub}>Let's make your plants thrive today 🌿</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statNum}>12</Text><Text style={styles.statLabel}>Plants</Text></View>
          <View style={styles.statCard}><Text style={styles.statNum}>98%</Text><Text style={styles.statLabel}>Health</Text></View>
          <View style={styles.statCard}><Text style={styles.statNum}>🔥 7</Text><Text style={styles.statLabel}>Streak</Text></View>
        </View>
      </LinearGradient>

      <Text style={styles.section}>✨ Your Plants</Text>
      <FlatList
        data={plants}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={[styles.dot, { backgroundColor: item.status === "ok" ? "#22c55e" : "#f59e0b" }]} />
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>Next water: {item.nextWater}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  greeting: { fontSize: 28, fontWeight: "800", color: "#fff", fontFamily: "Inter" },
  sub: { fontSize: 15, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  statCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, padding: 16, alignItems: "center" },
  statNum: { fontSize: 22, fontWeight: "800", color: "#fff" },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
  section: { fontSize: 20, fontWeight: "700", margin: 24, marginBottom: 12 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 24, marginBottom: 12, padding: 20, borderRadius: 20, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 16 },
  cardTitle: { fontSize: 17, fontWeight: "700" },
  cardSub: { fontSize: 13, color: "#94a3b8", marginTop: 2 },
});
