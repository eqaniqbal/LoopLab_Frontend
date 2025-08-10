import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewCourse({ route }) {
  const { userProfileId, userProfileName } = route.params;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoOrder, setVideoOrder] = useState("");
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);

  const API_URL = "http://loclhost:1337";

  // Fetch courses for teacher
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/newcourses?filters[user_profile][id][$eq]=${userProfileId}&populate=video_lectures`
      );
      const json = await res.json();
      setCourses(json.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Save course (Create or Update)
  const saveCourse = async () => {
    try {
      const method = editingCourseId ? "PUT" : "POST";
      const url = editingCourseId
        ? `${API_URL}/newcourses/${editingCourseId}`
        : `${API_URL}/newcourses`;

      const body = {
        data: {
          title: courseTitle,
          description: courseDescription,
          category: courseCategory,
          user_profile: userProfileId,
        },
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save course");
      fetchCourses();
      setCourseModalVisible(false);
      resetCourseForm();
    } catch (err) {
      console.error(err);
    }
  };

  const resetCourseForm = () => {
    setCourseTitle("");
    setCourseDescription("");
    setCourseCategory("");
    setEditingCourseId(null);
  };

  // Delete course
  const deleteCourse = (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this course?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`${API_URL}/newcourses/${id}`, { method: "DELETE" });
            fetchCourses();
          } catch (err) {
            console.error(err);
          }
        },
      },
    ]);
  };

  // Fetch videos for a course
  const fetchVideos = async (courseId) => {
    setCurrentCourseId(courseId);
    try {
      const res = await fetch(
        `${API_URL}/video-lectures?filters[course][id][$eq]=${courseId}`
      );
      const json = await res.json();
      setVideos(json.data);
      setVideoModalVisible(true);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  // Save video
  const saveVideo = async () => {
    try {
      const method = editingVideoId ? "PUT" : "POST";
      const url = editingVideoId
        ? `${API_URL}/video-lectures/${editingVideoId}`
        : `${API_URL}/video-lectures`;

      const body = {
        data: {
          title: videoTitle,
          description: videoDescription,
          duration: parseInt(videoDuration) || 0,
          order: parseInt(videoOrder) || 0,
          course: currentCourseId,
        },
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save video");
      fetchVideos(currentCourseId);
      resetVideoForm();
    } catch (err) {
      console.error(err);
    }
  };

  const resetVideoForm = () => {
    setVideoTitle("");
    setVideoDescription("");
    setVideoDuration("");
    setVideoOrder("");
    setEditingVideoId(null);
  };

  // Delete video
  const deleteVideo = (id) => {
    Alert.alert("Confirm Delete", "Delete this video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`${API_URL}/video-lectures/${id}`, { method: "DELETE" });
            fetchVideos(currentCourseId);
          } catch (err) {
            console.error(err);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Courses for {userProfileName}</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={fetchCourses}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <Text style={styles.courseName}>{item.attributes.title}</Text>
            <Text>{item.attributes.description}</Text>
            <Text>Category: {item.attributes.category}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => {
                  setEditingCourseId(item.id);
                  setCourseTitle(item.attributes.title);
                  setCourseDescription(item.attributes.description);
                  setCourseCategory(item.attributes.category);
                  setCourseModalVisible(true);
                }}
              >
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteCourse(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => fetchVideos(item.id)}>
                <Text style={styles.manage}>Manage Videos</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetCourseForm();
          setCourseModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Course</Text>
      </TouchableOpacity>

      {/* Course Modal */}
      <Modal visible={courseModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Title"
              value={courseTitle}
              onChangeText={setCourseTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={courseDescription}
              onChangeText={setCourseDescription}
              style={styles.input}
            />
            <TextInput
              placeholder="Category"
              value={courseCategory}
              onChangeText={setCourseCategory}
              style={styles.input}
            />
            <Button title="Save" onPress={saveCourse} />
            <Button
              title="Cancel"
              color="red"
              onPress={() => setCourseModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Video Modal */}
      <Modal visible={videoModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.subtitle}>Video Lectures</Text>
              {videos.map((v) => (
                <View key={v.id} style={styles.videoCard}>
                  <Text>
                    {v.attributes.title} ({v.attributes.duration} mins)
                  </Text>
                  <Text>{v.attributes.description}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingVideoId(v.id);
                        setVideoTitle(v.attributes.title);
                        setVideoDescription(v.attributes.description);
                        setVideoDuration(String(v.attributes.duration));
                        setVideoOrder(String(v.attributes.order));
                      }}
                    >
                      <Text style={styles.edit}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteVideo(v.id)}>
                      <Text style={styles.delete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <Text style={{ marginTop: 10 }}>Add/Edit Video</Text>
              <TextInput
                placeholder="Video Title"
                value={videoTitle}
                onChangeText={setVideoTitle}
                style={styles.input}
              />
              <TextInput
                placeholder="Video Description"
                value={videoDescription}
                onChangeText={setVideoDescription}
                style={styles.input}
              />
              <TextInput
                placeholder="Duration (minutes)"
                value={videoDuration}
                onChangeText={setVideoDuration}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Order"
                value={videoOrder}
                onChangeText={setVideoOrder}
                keyboardType="numeric"
                style={styles.input}
              />
              <Button title="Save Video" onPress={saveVideo} />
              <Button
                title="Close"
                color="red"
                onPress={() => setVideoModalVisible(false)}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  courseCard: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
    borderRadius: 5,
  },
  courseName: { fontSize: 16, fontWeight: "bold" },
  actions: { flexDirection: "row", marginTop: 5, gap: 15 },
  edit: { color: "blue" },
  delete: { color: "red" },
  manage: { color: "green" },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { color: "white", fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 5,
    maxHeight: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  videoCard: {
    padding: 8,
    backgroundColor: "#eee",
    marginBottom: 8,
    borderRadius: 5,
  },
});
