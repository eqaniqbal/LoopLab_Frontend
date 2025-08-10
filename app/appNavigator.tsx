import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Existing screens
import CourseScreen from "../screens/CourseScreen";
import LandingPage from "../screens/LandingPage";
import LoginScreen from "../screens/LoginScreen";
import RegisterationScreen from "../screens/RegisterationScreen";
import StudentDashboard from "../screens/StudentDashboard";
import TeacherDashboard from "../screens/TeacherDashboard";

// New Student-related screens
import EventsScreen from "../screens/EventsScreen";
import LeaderboardBadgesScreen from "../screens/LeaderboardBadgesScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AnnouncementsScreen from "../screens/AnnouncementsScreen";
import AIChatbotScreen from "../screens/AIChatbotScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Student">
      {/* Common */}
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registeration" component={RegisterationScreen} />

      {/* Student */}
      <Stack.Screen name="Student" component={StudentDashboard} />
      <Stack.Screen name="Course" component={CourseScreen} />
      <Stack.Screen name="EventsScreen" component={EventsScreen} />
      <Stack.Screen name="LeaderboardBadgesScreen" component={LeaderboardBadgesScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="AnnouncementsScreen" component={AnnouncementsScreen} />
      <Stack.Screen name="AIChatbotScreen" component={AIChatbotScreen} />

      {/* Teacher */}
      <Stack.Screen name="Teacher" component={TeacherDashboard} />
    </Stack.Navigator>
  );
}
