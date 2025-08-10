import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const purple = "#6a0dad";

export default function LeaderboardBadgesScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = darkMode
    ? { background: "#121214", text: "#E0DFF0", cardBg: "#1E1E2F" }
    : { background: "#FAFAFB", text: "#1E1E2F", cardBg: "#ffffff" };

  const leaderboard = [
    { id: 1, name: "Ayesha Khan", score: 120 },
    { id: 2, name: "Ali Raza", score: 115 },
    { id: 3, name: "Fatima Zahra", score: 110 },
  ];

  const badges = [
    { id: 1, name: "5 Videos Watched", earned: true },
    { id: 2, name: "3 Events Attended", earned: false },
    { id: 3, name: "Top 10 Leaderboard", earned: true },
  ];

  return (
    <ScrollView style={{ backgroundColor: theme.background, padding: 20 }}>
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.title, { color: theme.text }]}>Leaderboard</Text>
        {leaderboard.map((user) => (
          <Text key={user.id} style={{ color: theme.text }}>
            {user.id}. {user.name} — {user.score} pts
          </Text>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.title, { color: theme.text }]}>Badges</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
          {badges.map((badge) => (
            <View
              key={badge.id}
              style={[
                styles.badge,
                { backgroundColor: badge.earned ? purple : "#666" },
              ]}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>{badge.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, borderRadius: 12, marginBottom: 15, elevation: 4 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 8,
  },
});
