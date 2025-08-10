import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// IMPORTANT: Change this to your machine's LAN IP when testing on device/emulator
const STRAPI_URL = "http://localhost:1337"; 

export default function TeacherDashboard({ navigation, route }) {
  const { userProfileId, userProfileName } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Data states for all features
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [chatThreads, setChatThreads] = useState([]);
  const [learnerProgress, setLearnerProgress] = useState([]);

  // Modal & UI states
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");

  const fetchData = useCallback(async () => {
    if (!userProfileId) {
      Alert.alert("Error", "User profile ID missing");
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      if (!refreshing) setLoading(true);

      const [
        statsRes,
        coursesRes,
        liveRes,
        eventsRes,
        annRes,
        chatRes,
        progressRes,
      ] = await Promise.all([
        fetch(`${STRAPI_URL}/api/teacher/stats?filters[user_profile][id][$eq]=${userProfileId}`),
        fetch(`${STRAPI_URL}/api/courses?filters[user_profile][id][$eq]=${userProfileId}&populate=video_lectures,students`),
        fetch(`${STRAPI_URL}/api/live-sessions?filters[user_profile][id][$eq]=${userProfileId}`),
        fetch(`${STRAPI_URL}/api/events`),
        fetch(`${STRAPI_URL}/api/announcements?filters[target]=teachers`),
        fetch(`${STRAPI_URL}/api/chat-threads?filters[user_profiles][id][$eq]=${userProfileId}&populate=messages`),
        fetch(`${STRAPI_URL}/api/learner-progress?filters[teacher_profile][id][$eq]=${userProfileId}`),
      ]);

      if (!statsRes.ok) throw new Error("Failed to fetch stats");
      if (!coursesRes.ok) throw new Error("Failed to fetch courses");
      if (!liveRes.ok) throw new Error("Failed to fetch live sessions");
      if (!eventsRes.ok) throw new Error("Failed to fetch events");
      if (!annRes.ok) throw new Error("Failed to fetch announcements");
      if (!chatRes.ok) throw new Error("Failed to fetch chats");
      if (!progressRes.ok) throw new Error("Failed to fetch learner progress");

      setStats((await statsRes.json()).data);
      setCourses((await coursesRes.json()).data || []);
      setLiveSessions((await liveRes.json()).data || []);
      setEvents((await eventsRes.json()).data || []);
      setAnnouncements((await annRes.json()).data || []);
      setChatThreads((await chatRes.json()).data || []);
      setLearnerProgress((await progressRes.json()).data || []);
    } catch (err) {
      console.error("Error loading data:", err);
      Alert.alert("Error loading data", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userProfileId, refreshing]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const theme = darkMode
    ? {
        background: "#121214",
        text: "#E0DFF0",
        sectionBg: "#2E2363",
        gradient: ["#6B52AE", "#3D2C8D"],
        cardBg: "#352F65",
        switchThumb: "#B4A5F7",
      }
    : {
        background: "#FAFAFB",
        text: "#1E1E2F",
        sectionBg: "#E8E0FF",
        gradient: ["#B4A5F7", "#7E5BEF"],
        cardBg: "#D9D0FF",
        switchThumb: "#5A3FBF",
      };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.gradient[1]} />
      </View>
    );
  }

  const submitAnnouncement = () => {
    if (!announcementText.trim()) {
      Alert.alert("Error", "Announcement cannot be empty");
      return;
    }
    Keyboard.dismiss();
    // TODO: Implement API POST request for announcement here
    Alert.alert("Announcement Posted", announcementText);
    setAnnouncementText("");
    setShowAnnouncementModal(false);
  };

  const renderTile = (title, subtitle, onPress) => (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: theme.cardBg }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tileTitle, { color: theme.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.tileSubtitle, { color: theme.text }]}>{subtitle}</Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={theme.gradient}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={theme.gradient} />
        }
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>
            Welcome, {userProfileName }
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: theme.text, marginRight: 8 }}>Dark Mode</Text>
            <Switch
              value={darkMode}
              thumbColor={theme.switchThumb}
              onValueChange={() => setDarkMode(!darkMode)}
            />
          </View>
        </View>

        {/* Tiles */}
        <View style={styles.tilesContainer}>
          {renderTile(
            "Manage Courses",
            courses.length > 0 ? `You have ${courses.length} course(s)` : "No courses yet",
            () => navigation.navigate("Course", { userProfileId, userProfileName })
          )}
          {renderTile(
            "Host Live Sessions",
            liveSessions.length > 0
              ? `Upcoming: ${liveSessions.length}`
              : "No upcoming live sessions",
            () => navigation.navigate("LiveSessions", { userProfileId })
          )}
          {renderTile(
            "Track Learner Progress",
            learnerProgress.length > 0
              ? `Tracking ${learnerProgress.length} students`
              : "No learner progress data",
            () => navigation.navigate("LearnerProgress", { userProfileId })
          )}
          {renderTile(
            "Events",
            events.length > 0 ? `Upcoming: ${events.length}` : "No events",
            () => navigation.navigate("Events", { userProfileId })
          )}
          {renderTile(
            "Communication",
            chatThreads.length > 0 ? `Chats: ${chatThreads.length}` : "No chats",
            () => navigation.navigate("Communication", { userProfileId })
          )}
          {renderTile("Announcements", null, () => setShowAnnouncementModal(true))}
          {renderTile(
            "AI Assistant",
            "Ask questions or FAQs",
            () => navigation.navigate("AIAssistant", { userProfileId })
          )}
        </View>

        {/* Announcement Modal */}
        <Modal visible={showAnnouncementModal} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <View style={[styles.modalContainer, { backgroundColor: theme.sectionBg }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Post Announcement</Text>
              <TextInput
                multiline
                placeholder="Write announcement..."
                placeholderTextColor={darkMode ? "#CCC" : "#555"}
                style={[styles.announcementInput, { color: theme.text, borderColor: theme.text }]}
                value={announcementText}
                onChangeText={setAnnouncementText}
                textAlignVertical="top"
              />
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  onPress={submitAnnouncement}
                  style={[styles.button, { backgroundColor: theme.gradient[1] }]}
                >
                  <Text style={{ color: "#fff" }}>Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAnnouncementModal(false);
                    setAnnouncementText("");
                    Keyboard.dismiss();
                  }}
                  style={[styles.button, { backgroundColor: "gray" }]}
                >
                  <Text style={{ color: "#fff" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: "700" },
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: "48%",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  tileTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  tileSubtitle: { fontSize: 14 },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  announcementInput: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
});
