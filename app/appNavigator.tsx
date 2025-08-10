import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CourseScreen from "../screens/CourseScreen";
import LandingPage from "../screens/LandingPage";
import LoginScreen from "../screens/LoginScreen";
import RegisterationScreen from "../screens/RegisterationScreen";
import StudentDashboard from "../screens/StudentDashboard";
import TeacherDashboard from "../screens/TeacherDashboard";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registeration" component={RegisterationScreen} />
      <Stack.Screen name="Student" component={StudentDashboard} />
      <Stack.Screen name="Teacher" component={TeacherDashboard} />
      <Stack.Screen name="Course" component={CourseScreen} />
    </Stack.Navigator>
  );
}
