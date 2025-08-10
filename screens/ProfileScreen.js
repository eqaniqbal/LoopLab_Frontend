import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";

export default function ProfileScreen() {
  const theme = {
    background: "#FAFAFB",
    text: "#1E1E2F",
    buttonBg: "#7E5BEF",
    buttonText: "#FAFAFB",
  };

  return (
    <ScrollView style={{ backgroundColor: theme.background, padding: 20 }}>
      <View style={[styles.card, { backgroundColor: "#fff" }]}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
        <Text style={{ color: theme.text }}>Name: Fatima Zahra</Text>
        <Text style={{ color: theme.text }}>Email: fatima@example.com</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.buttonBg }]}
          onPress={() => Alert.alert("Navigate", "Edit Profile")}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, borderRadius: 12, marginBottom: 15, elevation: 4 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: { fontWeight: "700", fontSize: 16 },
});
