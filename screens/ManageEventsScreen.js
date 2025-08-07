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

export default function ManageEventsScreen({ navigation }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/events`, {
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
      setEvents(data)
    } catch (error) {
      console.error("Error loading events:", error.message)
      Alert.alert("Error", "Failed to load events")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchEvents()
  }

  const handleDeleteEvent = (eventId, eventName) => {
    Alert.alert("Delete Event", `Are you sure you want to delete "${eventName}"? This action cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteEvent(eventId),
      },
    ])
  }

  const deleteEvent = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      Alert.alert("Success", "Event deleted successfully")
      fetchEvents() // Refresh the list
    } catch (error) {
      console.error("Error deleting event:", error.message)
      Alert.alert("Error", "Failed to delete event")
    }
  }

  const getEventImageSource = (event) => {
    if (event.image && event.image.trim()) {
      return { uri: `data:image/jpeg;base64,${event.image}` }
    }
    return require("../assets/sample-event.jpg")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const renderEventItem = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventImageContainer}>
        <Image source={getEventImageSource(item)} style={styles.eventImage} />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.imageGradient} />
      </View>

      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.eventActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditEvent", { event: item })}
            >
              <Ionicons name="pencil" size={18} color="#d24242" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEvent(item.id, item.name)}>
              <Ionicons name="trash" size={18} color="#ff4444" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Ionicons name="calendar-outline" size={16} color="#d24242" />
            <Text style={styles.eventDetailText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <Ionicons name="time-outline" size={16} color="#d24242" />
            <Text style={styles.eventDetailText}>{formatTime(item.date)}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={14} color="#141414" />
            <Text style={styles.locationText}>{item.lieu?.nom || "Location TBD"}</Text>
          </View>
          <Text style={styles.eventId}>ID: {item.id}</Text>
        </View>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#141414" />
        <ActivityIndicator size="large" color="#d24242" />
        <Text style={styles.loadingText}>Loading events...</Text>
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

        <Text style={styles.headerTitle}>Events Management</Text>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddEvent")}>
          <Ionicons name="add" size={24} color="#d24242" />
        </TouchableOpacity>
      </View>

      {/* Stats Header */}
      <View style={styles.statsHeader}>
        <LinearGradient colors={["#d24242", "#d2425a"]} style={styles.statsGradient}>
          <View style={styles.statsContent}>
            <Text style={styles.statsNumber}>{events.length}</Text>
            <Text style={styles.statsLabel}>Total Events</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Events List */}
      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#666" />
          <Text style={styles.emptyTitle}>No Events Found</Text>
          <Text style={styles.emptySubtitle}>Create your first event to get started</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("AddEvent")}>
            <LinearGradient colors={["#d24242", "#d2425a"]} style={styles.createButtonGradient}>
              <Ionicons name="add" size={20} color="#ffffff" />
              <Text style={styles.createButtonText}>Create Event</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
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
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(210, 66, 66, 0.1)",
  },
  statsHeader: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statsGradient: {
    borderRadius: 16,
    padding: 20,
  },
  statsContent: {
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.9,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
  },
  eventImageContainer: {
    height: 120,
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    marginRight: 12,
  },
  eventActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(210, 66, 66, 0.1)",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
  eventDescription: {
    fontSize: 14,
    color: "#E4E4E4",
    marginBottom: 12,
    lineHeight: 20,
  },
  eventDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  eventDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eventDetailText: {
    fontSize: 14,
    color: "#E4E4E4",
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d24242",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#141414",
  },
  eventId: {
    fontSize: 12,
    color: "#999",
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
    marginBottom: 32,
  },
  createButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
})
