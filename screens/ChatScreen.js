import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";

export default function ChatScreen() {
  const theme = {
    background: "#FAFAFB",
    text: "#1E1E2F",
    buttonBg: "#7E5BEF",
    buttonText: "#FAFAFB",
  };

  return (
    <ScrollView style={{ backgroundColor: theme.background, padding: 20 }}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBg }]}
        onPress={() => Alert.alert("Navigate", "Open 1:1 Chat")}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>
          1:1 Chat with Teachers
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBg }]}
        onPress={() => Alert.alert("Navigate", "Open Group Chatrooms")}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>
          Group Chatrooms
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: { fontWeight: "700", fontSize: 16 },
});
