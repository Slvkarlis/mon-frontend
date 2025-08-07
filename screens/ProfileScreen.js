"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, StatusBar } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import MainLayout from "../components/MainLayout"

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [image, setImage] = useState(null)
  const [userStats, setUserStats] = useState({
    events: 5,
    points: 12,
    badges: 3,
  })

  useEffect(() => {
    const loadUser = async () => {
      const emailStored = await AsyncStorage.getItem("email")
      const imageStored = await AsyncStorage.getItem("image")
      if (emailStored) setEmail(emailStored)
      if (imageStored) setImage(imageStored)
    }
    loadUser()
  }, [])

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("email")
    await AsyncStorage.removeItem("image")
    Alert.alert("See you later! 👋", "You've been logged out. We'll see you soon for new events!")
    navigation.navigate("Login")
  }

  const navigateToPage = (pageName) => {
    navigation.navigate(pageName)
  }

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#141414" />

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>My Profile 🎉</Text>
              <Text style={styles.headerSubtitle}>Ready for adventure?</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#E4E4E4" />
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <LinearGradient colors={["#d24242", "#ff6b6b", "#d24242"]} style={styles.profilePlaceholder}>
                  <Text style={styles.profileEmoji}>🎭</Text>
                </LinearGradient>
              )}
              <TouchableOpacity style={styles.cameraButton}>
                <Text style={styles.cameraEmoji}>📸</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{email?.split("@")[0] || "Party Lover"}</Text>
            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>🔥 {userStats.events}</Text>
                <Text style={styles.statLabel}>Events</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>⭐ {userStats.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>🎊 {userStats.badges}</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>
          </View>

          {/* Fun Menu Cards */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuCard} onPress={() => navigateToPage("Friends")}>
              <LinearGradient
                colors={["#ff0040", "#000000ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>👥</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>My Squad</Text>
                    <Text style={styles.cardSubtitle}>Find your party buddies! 🎉</Text>
                  </View>
                  <View style={styles.cardBadge}>
                    <Text style={styles.badgeText}>NEW</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={() => navigateToPage("Interests")}>
              <LinearGradient
                colors={["#d43c3cff", "#000000ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>🎵</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>My Interests</Text>
                    <Text style={styles.cardSubtitle}>Music, sports, parties...</Text>
                  </View>
                  <Ionicons name="musical-notes" size={20} color="#ffffff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={() => navigateToPage("Achievements")}>
              <LinearGradient
                colors={["#ffbf00", "#000000ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>🏆</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>My Achievements</Text>
                    <Text style={styles.cardSubtitle}>Unlock new badges!</Text>
                  </View>
                  <View style={styles.achievementDots}>
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={() => navigateToPage("Share")}>
              <LinearGradient
                colors={["#8e24aa", "#000000ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>📱</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>Share the App</Text>
                    <Text style={styles.cardSubtitle}>Invite your friends to join!</Text>
                  </View>
                  <Ionicons name="share-social" size={20} color="#ffffff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={() => navigateToPage("Settings")}>
              <LinearGradient colors={["#2a2a2a", "#1a1a1a"]} style={styles.cardGradient}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>⚙️</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>Settings</Text>
                    <Text style={styles.cardSubtitle}>Notifications, privacy...</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E4E4E4" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#E4E4E4",
    fontStyle: "italic",
  },
  logoutButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: "#2a2a2a",
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#d24242",
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#ffffff",
  },
  profileEmoji: {
    fontSize: 40,
  },
  cameraButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#141414",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cameraEmoji: {
    fontSize: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textTransform: "capitalize",
  },
  userStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#E4E4E4",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#444",
    marginHorizontal: 15,
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  cardGradient: {
    padding: 20,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  cardBadge: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#d24242",
    letterSpacing: 1,
  },
  achievementDots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  activeDot: {
    backgroundColor: "#ffffff",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  footerText: {
    fontSize: 16,
    color: "#E4E4E4",
    textAlign: "center",
    marginBottom: 20,
  },
  exploreButton: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#d24242",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  exploreGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  exploreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
})
