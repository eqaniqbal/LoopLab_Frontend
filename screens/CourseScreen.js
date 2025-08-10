import { useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function CourseScreen() {
  const colorScheme = useColorScheme(); // Detect dark or light mode
  const isDarkMode = colorScheme === "dark";

  const [scale] = useState(new Animated.Value(1));

  const animatePress = (callback) => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(callback);
  };

  // Functionalities
  const uploadNewCourse = () => {
    Alert.alert("Upload New Course", "Here you can integrate your upload logic.");
  };

  const deleteCourseVideo = () => {
    Alert.alert("Delete Course/Video", "Here you can integrate your delete logic.");
  };

  const updateCourse = () => {
    Alert.alert("Update Course", "Here you can integrate your update logic.");
  };

  const viewAllCourses = () => {
    Alert.alert("View All Courses", "Here you can integrate your view-all logic.");
  };

  const tiles = [
    { id: 1, title: "Upload New Course", onPress: uploadNewCourse },
    { id: 2, title: "Delete Course/Video", onPress: deleteCourseVideo },
    { id: 3, title: "Update Course", onPress: updateCourse },
    { id: 4, title: "View All Courses", onPress: viewAllCourses },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "#fff" },
      ]}
    >
      {tiles.map((tile) => (
        <Animated.View
          key={tile.id}
          style={[
            styles.tile,
            {
              backgroundColor: isDarkMode ? "#4B0082" : "#800080",
              transform: [{ scale }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.tileButton,
              { backgroundColor: isDarkMode ? "#000" : "#fff" },
            ]}
            activeOpacity={0.8}
            onPress={() => animatePress(tile.onPress)}
          >
            <Text
              style={{
                color: isDarkMode ? "#fff" : "#4B0082",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {tile.title}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tile: {
    borderRadius: 20,
    marginVertical: 10,
    padding: 5,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  tileButton: {
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
});
