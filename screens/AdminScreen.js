"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"



import API_URL from "../config/api"

export default function AdminScreen({ navigation }) {
  const [eventCount, setEventCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem("role")
      if (role !== "ADMIN") {
        navigation.replace("Forbidden")
      }
    }
    checkRole()

  const fetchEventCount = async () => {
    const count = await getEventCount();
    setEventCount(count);
  };

  fetchEventCount();
  
  const fetchUserCount = async () => {
    const count = await getUserCount();
    setUserCount(count);
  };

  fetchUserCount();
  }, [])

  const getEventCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // if using auth
      const response = await fetch(`${API_URL}/api/events/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch event count");
      }

      const count = await response.json(); // because it's a Long (number)
      return count; // number
    } catch (error) {
      console.error("Error fetching event count:", error);
      return 0; // fallback
    }
  };
  
  const getUserCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // if using auth
      const response = await fetch(`${API_URL}/api/countUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch event count");
      }

      const count = await response.json(); // because it's a Long (number)
      return count; // number
    } catch (error) {
      console.error("Error fetching event count:", error);
      return 0; // fallback
    }
  };

  const HeaderContent = (
    <View style={styles.headerContent}>
      <View style={styles.headerLeft} />
      <Text style={styles.headerTitle}>Dashboard</Text>
      <View style={styles.headerRight} />
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header with Conditional Blur and Transparent Gradient */}
      {Platform.OS === "ios" ? (
        <BlurView intensity={20} tint="dark" style={styles.headerBlurContainer}>
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.1)"]} // Dark, very subtle transparent gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradientOverlay}
          >
            {HeaderContent}
          </LinearGradient>
        </BlurView>
      ) : (
        <View style={styles.headerBlurContainer}>
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.3)"]} // Slightly more opaque for Android fallback
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradientOverlay}
          >
            {HeaderContent}
          </LinearGradient>
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <LinearGradient colors={["#d24242", "#d2425a"]} style={styles.welcomeGradient}>
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeEmoji}>👋</Text>
              <Text style={styles.welcomeTitle}>Welcome</Text>
              <Text style={styles.welcomeSubtitle}>Manage your events and platform</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Platform Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="calendar" size={24} color="#d24242" />
              </View>
              <Text style={styles.statNumber}>{eventCount}</Text>
              <Text style={styles.statLabel}>Total Events</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="people" size={24} color="#d24242" />
              </View>
              <Text style={styles.statNumber}>{userCount}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="trending-up" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statNumber}>+15%</Text>
              <Text style={styles.statLabel}>Growth</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
              </View>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Active Events</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.primaryActionButton} onPress={() => navigation.navigate("AddEvent")}>
            <LinearGradient colors={["#d24242", "#d2425a"]} style={styles.buttonGradient}>
              <View style={styles.buttonContent}>
                <View style={styles.buttonIcon}>
                  <Ionicons name="add-circle" size={24} color="#ffffff" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>Create New Event</Text>
                  <Text style={styles.buttonSubtitle}>Add a new event to the platform</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ffffff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryActionsGrid}>
            <TouchableOpacity style={styles.secondaryActionCard} onPress={() => navigation.navigate("ManageEvents")}>
              <View style={styles.secondaryActionIcon}>
                <Ionicons name="calendar-outline" size={28} color="#d24242" />
              </View>
              <Text style={styles.secondaryActionTitle}>Events</Text>
              <Text style={styles.secondaryActionSubtitle}>Manage all events</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryActionCard} onPress={() => navigation.navigate("ManageUsers")}>
              <View style={styles.secondaryActionIcon}>
                <Ionicons name="people-outline" size={28} color="#d24242" />
              </View>
              <Text style={styles.secondaryActionTitle}>Users</Text>
              <Text style={styles.secondaryActionSubtitle}>Manage all users</Text>
            </TouchableOpacity>
          </View>
          {/* New Quick Actions for Category and Lieu */}
          <View style={styles.secondaryActionsGrid}>
            <TouchableOpacity style={styles.secondaryActionCard} onPress={() => navigation.navigate("AddCategory")}>
              <View style={styles.secondaryActionIcon}>
                <Ionicons name="pricetag-outline" size={28} color="#d24242" />
              </View>
              <Text style={styles.secondaryActionTitle}>New Category</Text>
              <Text style={styles.secondaryActionSubtitle}>Add a new event category</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryActionCard} onPress={() => navigation.navigate("AddLieu")}>
              <View style={styles.secondaryActionIcon}>
                <Ionicons name="map-outline" size={28} color="#d24242" />
              </View>
              <Text style={styles.secondaryActionTitle}>New Location</Text>
              <Text style={styles.secondaryActionSubtitle}>Add a new event location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <ScrollView style={styles.activityList} showsVerticalScrollIndicator={false}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="person-add" size={16} color="#4CAF50" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New user registered</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="calendar" size={16} color="#2196F3" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Event "Tech Conference" updated</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="trash" size={16} color="#ff4444" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Event "Workshop" deleted</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            {/* Add more activity items here to test scrolling */}
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="person-add" size={16} color="#4CAF50" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Another user registered</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="calendar" size={16} color="#2196F3" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Event "Product Launch" created</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="trash" size={16} color="#ff4444" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>User "John Doe" deleted</Text>
                <Text style={styles.activityTime}>4 days ago</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingBottom: 100, // Space for bottom tab bar
  },
  headerBlurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Ensure it's above scrollable content
  },
  headerGradientOverlay: {
    paddingTop: 40, // Reduced padding for shorter bar
    paddingBottom: 10, // Reduced padding for shorter bar
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)", // Subtle border for luxury feel
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerLeft: {
    width: 40, // Keep space for alignment
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    flex: 1,
    paddingTop: 70, // Adjusted offset for new header height (40 + 20 + 10 = 70 approx)
  },
  scrollContent: {
    paddingBottom: 40,
  },
  welcomeSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  welcomeGradient: {
    borderRadius: 20,
    padding: 24,
  },
  welcomeContent: {
    alignItems: "center",
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.9,
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(210, 66, 66, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#E4E4E4",
    textAlign: "center",
  },
  actionsSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  primaryActionButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#d24242",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    padding: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.8,
  },
  secondaryActionsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  secondaryActionCard: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  secondaryActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(210, 66, 66, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryActionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  secondaryActionSubtitle: {
    fontSize: 12,
    color: "#E4E4E4",
    textAlign: "center",
  },
  activitySection: {
    marginHorizontal: 20,
  },
  activityList: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
    padding: 16,
    maxHeight: 250, // Add a maxHeight to make it scrollable within its section
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },
})
