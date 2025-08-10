// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   Linking,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Animated, {
//   interpolateColor,
//   useAnimatedStyle,
//   useSharedValue,
//   withRepeat,
//   withTiming,
// } from "react-native-reanimated";

// const purple = "#6a0dad";

// export default function StudentDashboard() {
//   const [darkMode, setDarkMode] = useState(false);

//   // Animation value for header gradient
//   const progress = useSharedValue(0);

//   useEffect(() => {
//     progress.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);
//   }, []);

//   // Animated gradient colors interpolate between two purples and blues
//   const animatedStyle = useAnimatedStyle(() => {
//     const backgroundColor = interpolateColor(
//       progress.value,
//       [0, 1],
//       ["#7E5BEF", "#3D2C8D"]
//     );
//     return { backgroundColor };
//   });

//   // Mock data for demonstration
//   const overview = {
//     enrolledCourses: 5,
//     videosWatched: 42,
//     upcomingSessions: 2,
//     notifications: 3,
//   };

//   const courses = [
//     { id: 1, title: "React Native Basics", progress: "75%" },
//     { id: 2, title: "Advanced JavaScript", progress: "40%" },
//     { id: 3, title: "UI Design Principles", progress: "100%" },
//   ];

//   const events = [
//     {
//       id: 1,
//       title: "LoopLab Hackathon",
//       date: "2025-08-15",
//       registered: true,
//     },
//     {
//       id: 2,
//       title: "Live Q&A with Teachers",
//       date: "2025-08-20",
//       registered: false,
//     },
//   ];

//   const badges = [
//     { id: 1, name: "5 Videos Watched", earned: true },
//     { id: 2, name: "3 Events Attended", earned: false },
//     { id: 3, name: "Top 10 Leaderboard", earned: true },
//   ];

//   const leaderboardPosition = 12;

//   const announcements = [
//     { id: 1, message: "New courses added this week!" },
//     { id: 2, message: "Live sessions every Friday at 6 PM." },
//   ];

//   const onRegisterEvent = (event) => {
//     Alert.alert(
//       "Event Registration",
//       `You have registered for "${event.title}"!`
//     );
//   };

//   const onAddToCalendar = (event) => {
//     const url = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
//       event.title
//     )}&dates=${event.date.replace(/-/g, "")}/${event.date.replace(/-/g, "")}&details=LoopLab+Event`;
//     Linking.openURL(url).catch(() =>
//       Alert.alert("Error", "Could not open calendar link")
//     );
//   };

//   const theme = darkMode
//     ? {
//         background: "#121214",
//         text: "#E0DFF0",
//         cardBg: "#1E1E2F",
//         buttonBg: "#6B52AE",
//         buttonText: "#E0DFF0",
//         switchTrack: "#B085FF",
//       }
//     : {
//         background: "#FAFAFB",
//         text: "#1E1E2F",
//         cardBg: "#ffffff",
//         buttonBg: "#7E5BEF",
//         buttonText: "#FAFAFB",
//         switchTrack: "#B4A5F7",
//       };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <Animated.View style={[styles.animatedHeader, animatedStyle]}>
//         <Text style={styles.headerTitle}>Student Dashboard</Text>
//         <View style={styles.darkModeToggle}>
//           <Text style={[styles.toggleText, { color: theme.text }]}>
//             Dark Mode
//           </Text>
//           <Switch
//             value={darkMode}
//             onValueChange={setDarkMode}
//             thumbColor={darkMode ? purple : "#f4f3f4"}
//             trackColor={{ false: "#767577", true: theme.switchTrack }}
//           />
//         </View>
//       </Animated.View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Overview */}
//         <Card theme={theme} title="Overview">
//           <Text style={[styles.text, { color: theme.text }]}>
//             Enrolled Courses: {overview.enrolledCourses}
//           </Text>
//           <Text style={[styles.text, { color: theme.text }]}>
//             Videos Watched: {overview.videosWatched}
//           </Text>
//           <Text style={[styles.text, { color: theme.text }]}>
//             Upcoming Sessions: {overview.upcomingSessions}
//           </Text>
//           <Text style={[styles.text, { color: theme.text }]}>
//             Notifications: {overview.notifications}
//           </Text>
//         </Card>

//         {/* Learning Section */}
//         <Card theme={theme} title="Learning">
//           {courses.map((course) => (
//             <View key={course.id} style={styles.listItem}>
//               <Text style={[styles.text, { color: theme.text }]}>
//                 {course.title}
//               </Text>
//               <Text style={[styles.text, { color: theme.text }]}>
//                 Progress: {course.progress}
//               </Text>
//             </View>
//           ))}
//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: theme.buttonBg }]}
//             onPress={() => Alert.alert("Navigate", "Go to Course Browser")}
//           >
//             <Text style={[styles.buttonText, { color: theme.buttonText }]}>
//               Browse Courses
//             </Text>
//           </TouchableOpacity>
//         </Card>

//         {/* Events */}
//         <Card theme={theme} title="Events">
//           {events.map((event) => (
//             <View key={event.id} style={styles.listItemRow}>
//               <View>
//                 <Text style={[styles.text, { color: theme.text }]}>
//                   {event.title}
//                 </Text>
//                 <Text style={[styles.text, { color: theme.text }]}>
//                   Date: {event.date}
//                 </Text>
//               </View>

//               <View style={{ flexDirection: "row", gap: 10 }}>
//                 {!event.registered ? (
//                   <TouchableOpacity
//                     style={[styles.buttonSmall, { backgroundColor: theme.buttonBg }]}
//                     onPress={() => onRegisterEvent(event)}
//                   >
//                     <Text style={[styles.buttonText, { color: theme.buttonText }]}>
//                       Register
//                     </Text>
//                   </TouchableOpacity>
//                 ) : (
//                   <TouchableOpacity
//                     style={[styles.buttonSmall, { backgroundColor: "#444" }]}
//                     onPress={() => onAddToCalendar(event)}
//                   >
//                     <Text style={[styles.buttonText, { color: "#ddd" }]}>
//                       Add to Calendar
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//           ))}
//         </Card>

//         {/* Communication */}
//         <Card theme={theme} title="Communication">
//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: theme.buttonBg }]}
//             onPress={() => Alert.alert("Navigate", "Open 1:1 Chat")}
//           >
//             <Text style={[styles.buttonText, { color: theme.buttonText }]}>
//               1:1 Chat with Team/Teachers
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: theme.buttonBg }]}
//             onPress={() => Alert.alert("Navigate", "Open Group Discussions")}
//           >
//             <Text style={[styles.buttonText, { color: theme.buttonText }]}>
//               Join Group Chatrooms
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: theme.buttonBg }]}
//             onPress={() => Alert.alert("AI Chatbot", "Open Support Chatbot")}
//           >
//             <Text style={[styles.buttonText, { color: theme.buttonText }]}>
//               Support AI Chatbot
//             </Text>
//           </TouchableOpacity>
//         </Card>

//         {/* Announcements */}
//         <Card theme={theme} title="Announcements & Notifications">
//           {announcements.map((item) => (
//             <Text
//               key={item.id}
//               style={[styles.text, { color: theme.text, marginBottom: 6 }]}
//             >
//               • {item.message}
//             </Text>
//           ))}
//         </Card>

//         {/* Gamification */}
//         <Card theme={theme} title="Gamification">
//           <Text style={[styles.text, { color: theme.text }]}>
//             Leaderboard Position: #{leaderboardPosition}
//           </Text>
//           <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
//             {badges.map((badge) => (
//               <View
//                 key={badge.id}
//                 style={[
//                   styles.badge,
//                   { backgroundColor: badge.earned ? purple : "#666" },
//                 ]}
//               >
//                 <Text style={{ color: "#fff", fontWeight: "600" }}>
//                   {badge.name}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </Card>

//         {/* Profile */}
//         <Card theme={theme} title="Profile">
//           <Text style={[styles.text, { color: theme.text }]}>
//             Name: Fatima Zahra
//           </Text>
//           <Text style={[styles.text, { color: theme.text }]}>
//             Email: fatima@example.com
//           </Text>
//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: theme.buttonBg, marginTop: 10 }]}
//             onPress={() => Alert.alert("Navigate", "Edit Profile")}
//           >
//             <Text style={[styles.buttonText, { color: theme.buttonText }]}>
//               Edit Profile
//             </Text>
//           </TouchableOpacity>
//         </Card>
//       </ScrollView>
//     </View>
//   );
// }

// function Card({ children, title, theme }) {
//   return (
//     <View
//       style={[
//         styles.card,
//         { backgroundColor: theme?.cardBg || "#fff", shadowColor: purple },
//       ]}
//     >
//       <Text style={[styles.cardTitle, { color: theme?.text || "#000" }]}>
//         {title}
//       </Text>
//       {children}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   animatedHeader: {
//     paddingTop: Platform.OS === "ios" ? 60 : 40,
//     paddingBottom: 20,
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   darkModeToggle: {
//     marginTop: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   toggleText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#fff",
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   card: {
//     borderRadius: 16,
//     padding: 15,
//     marginBottom: 20,
//     // iOS shadow
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 5 },
//     // Android shadow
//     elevation: 4,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 12,
//   },
//   text: {
//     fontSize: 16,
//   },
//   listItem: {
//     marginBottom: 12,
//   },
//   listItemRow: {
//     marginBottom: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   button: {
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginTop: 12,
//     alignItems: "center",
//   },
//   buttonSmall: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   buttonText: {
//     fontWeight: "700",
//     fontSize: 16,
//   },
//   badge: {
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 16,
//     marginRight: 10,
//     marginBottom: 8,
//   },
// });
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const purple = "#6a0dad";

export default function StudentDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();

  // Animation
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#7E5BEF", "#3D2C8D"]
    );
    return { backgroundColor };
  });

  const theme = darkMode
    ? {
        background: "#121214",
        text: "#E0DFF0",
        cardBg: "#1E1E2F",
        buttonBg: "#6B52AE",
        buttonText: "#E0DFF0",
        switchTrack: "#B085FF",
      }
    : {
        background: "#FAFAFB",
        text: "#1E1E2F",
        cardBg: "#ffffff",
        buttonBg: "#7E5BEF",
        buttonText: "#FAFAFB",
        switchTrack: "#B4A5F7",
      };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.animatedHeader, animatedStyle]}>
        <Text style={styles.headerTitle}>Student Dashboard</Text>
        <View style={styles.darkModeToggle}>
          <Text style={[styles.toggleText, { color: theme.text }]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? purple : "#f4f3f4"}
            trackColor={{ false: "#767577", true: theme.switchTrack }}
          />
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick Navigation */}
        <Card theme={theme} title="Quick Access">
          <DashboardButton title="My Courses" theme={theme} onPress={() => navigation.navigate("CoursesScreen")} />
          <DashboardButton title="Events" theme={theme} onPress={() => navigation.navigate("EventsScreen")} />
          <DashboardButton title="Leaderboard & Badges" theme={theme} onPress={() => navigation.navigate("LeaderboardBadgesScreen")} />
          <DashboardButton title="Chat" theme={theme} onPress={() => navigation.navigate("ChatScreen")} />
          <DashboardButton title="Announcements" theme={theme} onPress={() => navigation.navigate("AnnouncementsScreen")} />
          <DashboardButton title="AI Chatbot" theme={theme} onPress={() => navigation.navigate("AIChatbotScreen")} />
          <DashboardButton title="Profile" theme={theme} onPress={() => navigation.navigate("ProfileScreen")} />
        </Card>
      </ScrollView>
    </View>
  );
}

function Card({ children, title, theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme?.cardBg || "#fff", shadowColor: purple }]}>
      <Text style={[styles.cardTitle, { color: theme?.text || "#000" }]}>{title}</Text>
      {children}
    </View>
  );
}

function DashboardButton({ title, theme, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBg }]} onPress={onPress}>
      <Text style={[styles.buttonText, { color: theme.buttonText }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  animatedHeader: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  darkModeToggle: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 8 },
  toggleText: { fontSize: 16, fontWeight: "600" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  button: { paddingVertical: 12, borderRadius: 10, marginBottom: 10, alignItems: "center" },
  buttonText: { fontWeight: "700", fontSize: 16 },
});
