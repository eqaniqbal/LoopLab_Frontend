import * as AuthSession from "expo-auth-session";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const STRAPI_URL = "http://localhost:1337";

export default function LoginScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = darkMode
    ? {
        background: "#121214",
        text: "#E0DFF0",
        inputBg: "#2E2363",
        inputText: "#E0DFF0",
        placeholder: "#A89DEE",
        gradient: ["#6B52AE", "#3D2C8D"],
        buttonText: "#FFFFFF",
        statusBar: "light-content",
        link: "#9B84D6",
      }
    : {
        background: "#FAFAFB",
        text: "#1E1E2F",
        inputBg: "#E8E0FF",
        inputText: "#1E1E2F",
        placeholder: "#7E5BEF",
        gradient: ["#B4A5F7", "#7E5BEF"],
        buttonText: "#FAFAFB",
        statusBar: "dark-content",
        link: "#5A3FBF",
      };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });
      const data = await res.json();
      if (data.jwt) {
        navigation.navigate(`${data.user.role.name}Dashboard`);
      } else {
        alert(data.error?.message || "Login failed");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    const redirectUrl = AuthSession.makeRedirectUri();
    const authUrl = `${STRAPI_URL}/api/connect/${provider}?redirect=${encodeURIComponent(
      redirectUrl
    )}`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
    console.log(result);
    setShowSocialModal(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={theme.statusBar} />
      <TouchableOpacity
        style={styles.themeToggle}
        onPress={() => setDarkMode(!darkMode)}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 24 }}>{darkMode ? "☀️" : "🌙"}</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Login to LoopVerse 2025
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              color: theme.inputText,
              borderColor: darkMode ? "#4B3F99" : "#B7A7F9",
            },
          ]}
          placeholder="Email"
          placeholderTextColor={theme.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              color: theme.inputText,
              borderColor: darkMode ? "#4B3F99" : "#B7A7F9",
            },
          ]}
          placeholder="Password"
          placeholderTextColor={theme.placeholder}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
          style={{ marginBottom: 15 }}
        >
          <LinearGradient colors={theme.gradient} style={styles.loginButton}>
            <Text style={[styles.loginText, { color: theme.buttonText }]}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Forgot password and register links */}
        <View style={styles.linksRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            activeOpacity={0.7}
          >
            <Text style={[styles.linkText, { color: theme.link }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Text style={[styles.separator, { color: theme.text }]}>|</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Registeration")}
            activeOpacity={0.7}
          >
            <Text style={[styles.linkText, { color: theme.link }]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.socialLoginTrigger}
          onPress={() => setShowSocialModal(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.socialLoginTriggerText, { color: theme.text }]}>
            Or continue with social login
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Social Login Modal */}
      <Modal
        visible={showSocialModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSocialModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: darkMode ? "#2E2363" : "#E8E0FF" },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: theme.text, marginBottom: 15 },
              ]}
            >
              Social Login
            </Text>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
              onPress={() => handleSocialLogin("google")}
            >
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
              onPress={() => handleSocialLogin("facebook")}
            >
              <Text style={styles.socialText}>Continue with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSocialModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 4,
  },
  loginText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  linksRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
    alignItems: "center",
  },
  linkText: {
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: "underline",
    paddingHorizontal: 10,
  },
  separator: {
    fontSize: 15,
    fontWeight: "600",
    paddingHorizontal: 5,
  },
  socialLoginTrigger: {
    alignItems: "center",
  },
  socialLoginTriggerText: {
    fontSize: 16,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  themeToggle: {
    position: "absolute",
    top: 45,
    right: 25,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  socialButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    marginVertical: 8,
    alignItems: "center",
    elevation: 3,
  },
  socialText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 15,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
