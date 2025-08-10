import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function AIChatbotScreen() {
  const theme = { background: "#FAFAFB", text: "#1E1E2F", buttonBg: "#7E5BEF", buttonText: "#FAFAFB" };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>AI Chatbot</Text>
      <Text style={{ color: theme.text, marginBottom: 20 }}>
        Ask me anything about courses, events, or app features.
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBg }]}
        onPress={() => Alert.alert("Chatbot", "Opening AI Chatbot...")}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Start Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { fontWeight: "700", fontSize: 16 },
});
