import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function CourseScreen({ route }) {
  const { userProfileId, userProfileName } = route.params;

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pick video from device
  const pickVideo = async (index) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
      });
      if (!result.canceled) {
        const updated = [...lectures];
        updated[index].video = result.assets[0];
        setLectures(updated);
      }
    } catch (error) {
      Alert.alert("Error", "Could not pick video");
    }
  };

  // Add a new lecture row
  const addLecture = () => {
    setLectures([
      ...lectures,
      { title: "", description: "", video: null },
    ]);
  };

  // Remove lecture
  const removeLecture = (index) => {
    const updated = [...lectures];
    updated.splice(index, 1);
    setLectures(updated);
  };

  // Save course and lectures
  const saveCourse = async () => {
    if (!courseTitle.trim()) {
      Alert.alert("Error", "Please enter course title");
      return;
    }
    if (lectures.length === 0) {
      Alert.alert("Error", "Please add at least one lecture");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Course
      const courseRes = await fetch("http://192.168.1.107:1337/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            title: courseTitle,
            description: courseDescription,
            createdBy: userProfileId,
          },
        }),
      });

      const courseData = await courseRes.json();
      if (!courseRes.ok) {
        throw new Error(courseData.error?.message || "Course creation failed");
      }

      const courseId = courseData.data.id;

      // Step 2: Upload lectures
      for (const lecture of lectures) {
        const formData = new FormData();
        formData.append("files.video", {
          uri: lecture.video.uri,
          name: lecture.video.name,
          type: lecture.video.mimeType || "video/mp4",
        });
        formData.append(
          "data",
          JSON.stringify({
            title: lecture.title,
            description: lecture.description,
            course: courseId,
          })
        );

        const lectureRes = await fetch(
          "http://localhost:1337",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!lectureRes.ok) {
          throw new Error("Lecture upload failed");
        }
      }

      Alert.alert("Success", "Course and lectures saved successfully!");
      setCourseTitle("");
      setCourseDescription("");
      setLectures([]);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Create New Course</Text>

        <TextInput
          style={styles.input}
          placeholder="Course Title"
          value={courseTitle}
          onChangeText={setCourseTitle}
        />

        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Course Description"
          multiline
          value={courseDescription}
          onChangeText={setCourseDescription}
        />

        <Text style={styles.subHeading}>Lectures</Text>
        {lectures.map((lecture, index) => (
          <View key={index} style={styles.lectureCard}>
            <TextInput
              style={styles.input}
              placeholder="Lecture Title"
              value={lecture.title}
              onChangeText={(text) => {
                const updated = [...lectures];
                updated[index].title = text;
                setLectures(updated);
              }}
            />
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Lecture Description"
              value={lecture.description}
              onChangeText={(text) => {
                const updated = [...lectures];
                updated[index].description = text;
                setLectures(updated);
              }}
            />

            <TouchableOpacity
              style={styles.videoBtn}
              onPress={() => pickVideo(index)}
            >
              <Text style={styles.videoBtnText}>
                {lecture.video ? lecture.video.name : "Pick Video"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeLecture(index)}
            >
              <Text style={{ color: "white" }}>Remove Lecture</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addLecture}>
          <Text style={styles.addBtnText}>+ Add Lecture</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={saveCourse}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Course</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  lectureCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  videoBtn: {
    backgroundColor: "#ff9800",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  videoBtnText: {
    color: "white",
    fontWeight: "600",
  },
  removeBtn: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  saveBtn: {
    backgroundColor: "#2196f3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: {
    color: "white",
    fontWeight: "bold",
  },
});
