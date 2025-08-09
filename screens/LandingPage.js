import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

export default function LandingPage({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = darkMode
  ? {
      background: "#121214",           // Near-black charcoal
      text: "#E0DFF0",                 // Soft off-white text
      subText: "#BBB8D9",              // Muted lavender-grey
      card: "#5A3E99",                 // Deep rich purple tile background (updated)
      tileText: "#FFFFFF",             // White tile text
      tileShadowColor: "#2C1F6B",     // Dark purple shadow (updated)
      gradient: ["#6B52AE", "#3D2C8D"], // Elegant purple gradient
      buttonBg: "#7E5BEF",
      buttonText: "#FFFFFF",
      statusBar: "light-content",
    }
  : {
      background: "#FAFAFB",           // Clean soft white background
      text: "#1E1E2F",                 // Dark slate text
      subText: "#5F5E73",              // Greyish purple subtext
      card: "#7E5BEF",                 // Bright purple tile background
      tileText: "#FFFFFF",             // White tile text
      tileShadowColor: "#B9A9F7",     // Light purple shadow
      gradient: ["#B4A5F7", "#7E5BEF"],
      buttonBg: "#5F4BB6",
      buttonText: "#FAFAFB",
      statusBar: "dark-content",
    };

  const fadeStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(theme.background, { duration: 300 }),
  }));

  const features = [
    { icon: "🎥", title: "Video Lectures", desc: "Watch anytime, anywhere." },
    { icon: "🏆", title: "Leaderboard", desc: "Compete & earn rewards." },
    { icon: "📅", title: "Events", desc: "Join live workshops & more." },
    { icon: "💬", title: "Chat", desc: "1:1 & group discussions." },
  ];

  return (
    <Animated.View style={[{ flex: 1 }, fadeStyle]}>
      <StatusBar barStyle={theme.statusBar} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.logo, { color: theme.text }]}>LoopVerse 2025</Text>
        <TouchableOpacity
          onPress={() => setDarkMode(!darkMode)}
          style={[styles.toggleBtn, { backgroundColor: theme.buttonBg }]}
        >
          <Text style={{ color: theme.buttonText, fontSize: 18 }}>
            {darkMode ?  "🌙": "☀️" }
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Hero Section */}
        <LinearGradient colors={theme.gradient} style={styles.hero}>
          <Animatable.Text
            animation="fadeInDown"
            delay={200}
            style={[styles.heroTitle, { color: "#fff" }]}
          >
            Learn. Connect. Achieve.
          </Animatable.Text>
          <Animatable.Text
            animation="fadeInUp"
            delay={400}
            style={[styles.heroSubtitle, { color: "rgba(255, 255, 255, 0.8)" }]}
          >
            Courses, events, and community — all in one place.
          </Animatable.Text>
          <Animatable.View animation="zoomIn" delay={600}>
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: "#fff" }]}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={[styles.ctaText, { color: theme.gradient[1] }]}>
                Get Started
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </LinearGradient>

        {/* Features */}
        <View style={styles.tilesContainer}>
          {features.map((item, index) => (
            <Animatable.View
              key={index}
              animation="fadeInUp"
              delay={200 * index}
              style={[
                styles.tile,
                {
                  backgroundColor: theme.card,
                  shadowColor: theme.tileShadowColor,
                  elevation: 8,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  borderRadius: 14,
                },
              ]}
            >
              <Text style={[styles.tileIcon, { color: theme.tileText }]}>{item.icon}</Text>
              <Text style={[styles.tileTitle, { color: theme.tileText }]}>{item.title}</Text>
              <Text style={[styles.tileDesc, { color: theme.tileText }]}>{item.desc}</Text>
            </Animatable.View>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 22,
    fontWeight: "700",
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  hero: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    textAlign: "center",
    maxWidth: 320,
    marginBottom: 20,
    lineHeight: 24,
  },
  ctaButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  ctaText: {
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: 30,
  },
  tile: {
    width: "44%",
    margin: 10,
    padding: 22,
    alignItems: "center",
  },
  tileIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  tileTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  tileDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
