import { Picker } from "@react-native-picker/picker";
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

const STRAPI_URL = "http://localhost:1337"; // Change to your backend URL

export default function RegistrationScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("student"); // default role for user-profile.role
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = ["admin", "student", "teacher"];

  // Request permission & pick image from gallery
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0]);
    }
  }

  // Upload image to Strapi upload endpoint
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
      body: formData,
      headers: {
        // no content-type header, browser sets it including boundary for multipart form-data
      },
    });

    const data = await response.json();

    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data[0]; // Return uploaded file object
    } else {
      throw new Error("Image upload failed");
    }
  }

const handleRegister = async () => {
  if (!userName || !userEmail || !userPassword || !confirmPassword) {
    Alert.alert("Validation Error", "Please fill in all required fields.");
    return;
  }
  if (userPassword !== confirmPassword) {
    Alert.alert("Validation Error", "Passwords do not match.");
    return;
  }
  setLoading(true);

  try {
    // 1. Register user with built-in Strapi auth/local/register
    const registerResponse = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userName,
        email: userEmail,
        password: userPassword,
      }),
    });

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      Alert.alert("Registration Error", registerData.error?.message || "Failed to register user.");
      setLoading(false);
      return;
    }

    const { user, jwt } = registerData;
    const userId = user.id;

    // 2. Upload image if any
    let uploadedImageId = null;
    if (image) {
      const uploadedImage = await uploadImage(image);
      uploadedImageId = uploadedImage.id;
    }

    // 3. Create user-profile linked to this user, including email and password copy
    const profileResponse = await fetch(`${STRAPI_URL}/api/user-profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          user: userId,
          role: userRole,            // your enum field for app roles
          photo: uploadedImageId,    // media relation id or null
          userstatus: "active",
          email: userEmail,          // copy of email
          password: userPassword,    // copy of password (plain text)
          name:userName,
        },
      }),
    });

    const profileData = await profileResponse.json();

    if (!profileResponse.ok) {
      Alert.alert("Profile Creation Error", profileData.error?.message || "Failed to create user profile.");
      setLoading(false);
      return;
    }

    Alert.alert("Success", "Registration successful! Please login.");
    navigation.navigate("Login");
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Something went wrong during registration.");
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
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.7}>
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
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={userEmail}
            onChangeText={setUserEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={userPassword}
            onChangeText={setUserPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Role picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Role</Text>
            <Picker
              selectedValue={userRole}
              onValueChange={(itemValue) => setUserRole(itemValue)}
              style={styles.picker}
            >
              {roles.map((role) => (
                <Picker.Item
                  label={role.charAt(0).toUpperCase() + role.slice(1)}
                  value={role}
                  key={role}
                />
              ))}
            </Picker>
          </View>

          {/* Register button */}
          <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.registerButton}>
            <LinearGradient colors={["#7E5BEF", "#B4A5F7"]} style={styles.gradient}>
              <Text style={styles.registerButtonText}>{loading ? "Registering..." : "Register"}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login redirect */}
          <View style={styles.loginRedirect}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: "#7E5BEF", textDecorationLine: "underline" }}>Login</Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#C4B5FD",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B46C1",
    marginBottom: 4,
  },
  picker: {
    height: 40,
    width: "100%",
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
