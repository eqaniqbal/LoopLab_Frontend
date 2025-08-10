import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AnnouncementsScreen() {
  const theme = { background: "#FAFAFB", text: "#1E1E2F", cardBg: "#ffffff" };

  const announcements = [
    { id: 1, message: "New courses added this week!" },
    { id: 2, message: "Live sessions every Friday at 6 PM." },
  ];

  return (
    <ScrollView style={{ backgroundColor: theme.background, padding: 20 }}>
      {announcements.map((item) => (
        <View key={item.id} style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <Text style={{ color: theme.text }}>• {item.message}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
});
