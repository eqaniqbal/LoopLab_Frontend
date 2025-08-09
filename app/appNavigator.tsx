import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LandingPage from "../screens/LandingPage";
import LoginScreen from "../screens/LoginScreen";
import RegisterationScreen from "../screens/RegisterationScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registeration" component={RegisterationScreen} />
    </Stack.Navigator>
  );
}
