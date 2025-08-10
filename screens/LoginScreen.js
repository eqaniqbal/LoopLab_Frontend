import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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
        link: "#A89DEE",
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
  if (!email || !password) {
    Alert.alert("Validation Error", "Please enter both email and password");
    return;
  }

  setLoading(true);

  try {
    console.log("Starting login with email:", email);

    // 1. Authenticate user with Strapi
    const authRes = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: email,
        password,
      }),
    });

    const authData = await authRes.json();
    console.log("Auth response:", authData);

    if (!authRes.ok) {
      Alert.alert("Login failed", authData.error?.message || "Invalid credentials");
      setLoading(false);
      return;
    }

    const { jwt, user } = authData;

    // 2. Fetch user profile linked to this user by user id
    const profileRes = await fetch(
      `${STRAPI_URL}/api/user-profiles?filters[user][id][$eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    const profileData = await profileRes.json();
    console.log("Profile API response:", profileData);

    if (
      !profileRes.ok ||
      !profileData.data ||
      profileData.data.length === 0
    ) {
      Alert.alert("Error", "User profile not found");
      setLoading(false);
      return;
    }

    // 3. Extract user profile object
    // Adjust this according to your API response shape
    const userProfile = profileData.data[0]; // If your response is flat, no `.attributes`

    console.log("UserProfile:", userProfile);

    if (!userProfile) {
      Alert.alert("Login failed", "User profile data missing");
      setLoading(false);
      return;
    }

    if (userProfile.userstatus !== "active") {
      Alert.alert("Login failed", `Your account status is ${userProfile.userstatus}`);
      setLoading(false);
      return;
    }

    const role = userProfile.role;

    console.log("Role detected:", role);

    // 4. Navigate based on role
    switch (role) {
      case "student":
    navigation.navigate("Student", { userProfileId: userProfile.id });
    break;
  case "teacher":
    navigation.navigate("Teacher", { userProfileId: userProfile.id,
  userProfileName: userProfile.name});
    break;
  case "admin":
    navigation.navigate("Admin", { userProfileId: userProfile.id });
    break;
      default:
        Alert.alert("Login failed", "Invalid user role");
        break;
    }
  } catch (error) {
    console.error("Login error:", error);
    Alert.alert("Error", error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
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
          editable={!loading}
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
          editable={!loading}
        />

        <TouchableOpacity
          onPress={handleLogin}
          activeOpacity={0.85}
          style={{ marginBottom: 15 }}
          disabled={loading}
        >
          <LinearGradient colors={theme.gradient} style={styles.loginButton}>
            <Text style={[styles.loginText, { color: theme.buttonText }]}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.linksRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={[styles.linkText, { color: theme.link }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Text style={[styles.separator, { color: theme.text }]}>|</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Registeration")}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={[styles.linkText, { color: theme.link }]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  themeToggle: {
    position: "absolute",
    top: 45,
    right: 25,
    zIndex: 10,
  },
});
