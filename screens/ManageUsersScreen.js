"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import API_URL from "../config/api"

export default function ManageUsersScreen({ navigation }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({ total: 0, admins: 0, users: 0 })
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetchUsers()


    const fetchUserCount = async () => {
      const count = await getUserCount();
      setUserCount(count);
    };

    fetchUserCount();
  }, [])

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setUsers(data)

      // Calculate stats
      const adminCount = data.filter((user) => user.role === "ADMIN").length
      const userCount = data.filter((user) => user.role === "USER").length
      setStats({
        total: data.length,
        admins: adminCount,
        users: userCount,
      })
    } catch (error) {
      console.error("Error loading users:", error.message)
      Alert.alert("Error", "Failed to load users")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchUsers()
  }

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

  const handleToggleUserRole = (userId, currentRole, userName) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
    Alert.alert(
      "Change User Role",
      `Are you sure you want to change ${userName}'s role from ${currentRole} to ${newRole}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Change",
          onPress: () => updateUserRole(userId, newRole),
        },
      ],
    )
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      Alert.alert("Success", "User role updated successfully")
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error("Error updating user role:", error.message)
      Alert.alert("Error", "Failed to update user role")
    }
  }

  const handleDeleteUser = (userId, userName) => {
    Alert.alert("Delete User", `Are you sure you want to delete ${userName}? This action cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteUser(userId),
      },
    ])
  }

  const deleteUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      Alert.alert("Success", "User deleted successfully")
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error.message)
      Alert.alert("Error", "Failed to delete user")
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "role", "email", "image"])
      navigation.replace("Login") // or whatever your login screen is called
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color="#141414" />
              </View>
            )}
            <View style={[styles.roleBadge, item.role === "ADMIN" ? styles.adminBadge : styles.userBadge]}>
              <Text style={styles.roleBadgeText}>{item.role}</Text>
            </View>
          </View>

          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.name || "No Name"}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <View style={styles.userMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color="#d24242" />
                <Text style={styles.metaText}>Joined {formatDate(item.createdAt)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.userActions}>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => handleToggleUserRole(item.id, item.role, item.name || item.email)}
          >
            <Ionicons name="details" size={18} color="#d24242" />
          </TouchableOpacity>
          
        </View>
      </View>

      <View style={styles.userFooter}>
        <Text style={styles.userId}>ID: {item.id}</Text>
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>
    </View>
  )
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#141414" />
        <ActivityIndicator size="large" color="#d24242" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#E4E4E4" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Users Management</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#d24242" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Header */}
      <View style={styles.statsSection}>
        <LinearGradient colors={["#d24242", "#d2425a"]} style={styles.statsGradient}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userCount}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Users List */}
      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#666" />
          <Text style={styles.emptyTitle}>No Users Found</Text>
          <Text style={styles.emptySubtitle}>Users will appear here once they register</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#d24242" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingBottom: 100, // Space for bottom tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  loadingText: {
    color: "#E4E4E4",
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#141414",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerRight: {
    width: 40,
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statsGradient: {
    borderRadius: 16,
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
    padding: 16,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E4E4E4",
    justifyContent: "center",
    alignItems: "center",
  },
  roleBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },
  adminBadge: {
    backgroundColor: "#d24242",
  },
  userBadge: {
    backgroundColor: "#4CAF50",
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#E4E4E4",
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#E4E4E4",
  },
  userActions: {
    flexDirection: "row",
    gap: 8,
  },
  roleButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(210, 66, 66, 0.1)",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
  userFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  userId: {
    fontSize: 12,
    color: "#999",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#E4E4E4",
    textAlign: "center",
  },
})
