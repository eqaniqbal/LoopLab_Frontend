import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";

const purple = "#6a0dad";

export default function EventsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = darkMode
    ? {
        background: "#121214",
        text: "#E0DFF0",
        cardBg: "#1E1E2F",
        buttonBg: "#6B52AE",
        buttonText: "#E0DFF0",
      }
    : {
        background: "#FAFAFB",
        text: "#1E1E2F",
        cardBg: "#ffffff",
        buttonBg: "#7E5BEF",
        buttonText: "#FAFAFB",
      };

  const events = [
    { id: 1, title: "LoopLab Hackathon", date: "2025-08-15", registered: true },
    { id: 2, title: "Live Q&A with Teachers", date: "2025-08-20", registered: false },
  ];

  const onRegisterEvent = (event) => {
    Alert.alert("Event Registration", `You have registered for "${event.title}"!`);
  };

  const onAddToCalendar = (event) => {
    const url = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
      event.title
    )}&dates=${event.date.replace(/-/g, "")}/${event.date.replace(/-/g, "")}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open calendar link"));
  };

  return (
    <ScrollView style={{ backgroundColor: theme.background, padding: 20 }}>
      {events.map((event) => (
        <View key={event.id} style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.title, { color: theme.text }]}>{event.title}</Text>
          <Text style={{ color: theme.text }}>Date: {event.date}</Text>

          {!event.registered ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.buttonBg }]}
              onPress={() => onRegisterEvent(event)}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>Register</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#444" }]}
              onPress={() => onAddToCalendar(event)}
            >
              <Text style={[styles.buttonText, { color: "#ddd" }]}>Add to Calendar</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { fontWeight: "700" },
});
