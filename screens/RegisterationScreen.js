import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

// IMPORTANT: Replace 'localhost' with your machine IP when testing on real device/emulator
const STRAPI_URL = "http://localhost:1337";

export default function RegistrationScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const roles = ["Student", "Teacher"];  // exactly same as backend enum values
const [selectedRole, setSelectedRole] = useState("Student");

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0]);
    }
  }

  async function uploadImage(image) {
    const formData = new FormData();
    const uriParts = image.uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    formData.append("files", {
      uri: image.uri,
      name: `profile.${fileType}`,
      type: `image/${fileType}`,
    });

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      // DO NOT set Content-Type header for multipart/form-data
      body: formData,
    });

    const data = await response.json();

    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data[0]; // returns uploaded file object with id etc.
    } else {
      throw new Error("Image upload failed");
    }
  }

const handleRegister = async () => {
  if (!email || !password || !confirmPassword || !name) {
    Alert.alert("Validation Error", "Please fill in all required fields.");
    return;
  }
  if (password !== confirmPassword) {
    Alert.alert("Validation Error", "Passwords do not match.");
    return;
  }
  setLoading(true);

  try {
    let uploadedImage = null;

    // Upload image first (if any)
    if (image) {
      uploadedImage = await uploadImage(image);
    }

    // Step 1: Register with default fields only
    const userData = {
      username: name,
      email,
      password,
    };

    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert("Error", data?.error?.message || "Registration failed");
      setLoading(false);
      return;
    }

    // Step 2: Update user with extra fields Roles and profile_photo
    if (data.user && data.jwt) {
      const updateBody = {
        Roles: selectedRole,
      };
      if (uploadedImage) {
        updateBody.profile_photo = uploadedImage.id;
      }

      const updateRes = await fetch(`${STRAPI_URL}/api/users/${data.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.jwt}`,
        },
        body: JSON.stringify(updateBody),
      });

      if (!updateRes.ok) {
        const updateData = await updateRes.json();
        Alert.alert("Warning", "User registered but update failed: " + (updateData?.error?.message || JSON.stringify(updateData)));
      }
    }

    Alert.alert("Success", "Registration successful! Please login.");
    navigation.navigate("Login");
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Profile photo picker */}
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.imagePickerText}>Tap to select photo</Text>
            )}
          </TouchableOpacity>

          {/* Input fields */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email (min 6 chars)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password (min 6 chars)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Register button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={styles.registerButton}
          >
            <LinearGradient colors={["#7E5BEF", "#B4A5F7"]} style={styles.gradient}>
              <Text style={styles.registerButtonText}>
                {loading ? "Registering..." : "Register"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login redirect */}
          <View style={styles.loginRedirect}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: "#7E5BEF", textDecorationLine: "underline" }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA" },
  scrollContent: { paddingVertical: 40, paddingHorizontal: 20, flexGrow: 1 },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imagePicker: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#B4A5F7",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 30,
  },
  imagePickerText: { color: "#A0A0B2", fontWeight: "600", fontSize: 16 },
  profileImage: { height: 120, width: 120, borderRadius: 60 },
  input: {
    borderWidth: 1,
    borderColor: "#C4B5FD",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  registerButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  loginRedirect: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
});
