"use client"

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Linking, // For opening maps/links
  Platform, // Import Platform for selecting platform-specific URLs
  Animated, // Import Animated
  Easing, // Import Easing for smoother animation
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useRef } from "react" // Import useEffect and useRef

const { width, height } = Dimensions.get("window")

export default function EventDetailsScreen({ route, navigation }) {
  const { event } = route.params // Event object passed from HomeScreen

  // Animated value for the details container
  const translateYAnim = useRef(new Animated.Value(height)).current // Start from bottom of screen

  useEffect(() => {
    // Animate the details container up from the bottom
    Animated.timing(translateYAnim, {
      toValue: 0, // Animate to its original position
      duration: 600, // Animation duration
      easing: Easing.out(Easing.ease), // Easing function for a smooth effect
      useNativeDriver: true, // Use native driver for better performance
    }).start()
  }, [])

  if (!event) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#141414" />
        <Text style={styles.errorMessage}>Event details not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEventImageSource = (eventItem) => {
    if (eventItem.image && eventItem.image.trim()) {
      return { uri: `data:image/jpeg;base64,${eventItem.image}` }
    }
    return require("../assets/sample-event.jpg") // Fallback image
  }

  const openMap = (address) => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${address}`,
      android: `geo:0,0?q=${address}`,
    })
    Linking.openURL(url)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ImageBackground
          source={getEventImageSource(event)}
          style={styles.headerImage}
          imageStyle={styles.headerImageStyle}
        >
          <LinearGradient colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]} style={styles.headerOverlay}>
            <TouchableOpacity style={styles.backButtonTop} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.eventTitle}>{event.name}</Text>
              <Text style={styles.eventSubtitle}>{event.description || "No description available."}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        <Animated.View // Apply Animated.View here
          style={[
            styles.detailsContainer,
            {
              transform: [{ translateY: translateYAnim }], // Apply the animation
            },
          ]}
        >
          <View style={styles.detailCard}>
            <Ionicons name="calendar-outline" size={24} color="#d24242" />
            <View style={styles.detailTextGroup}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
            </View>
          </View>

          <View style={styles.detailCard}>
            <Ionicons name="time-outline" size={24} color="#d24242" />
            <View style={styles.detailTextGroup}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {formatTime(event.date)} - {formatTime(new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000))}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.detailCard} onPress={() => openMap(event.lieu?.adresse)}>
            <Ionicons name="location-outline" size={24} color="#d24242" />
            <View style={styles.detailTextGroup}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{event.lieu?.nom || "Location TBD"}</Text>
              <Text style={styles.detailSubValue}>{event.lieu?.adresse || "Address not available"}</Text>
            </View>
            <Ionicons name="map-outline" size={24} color="#E4E4E4" style={styles.mapIcon} />
          </TouchableOpacity>

          <View style={styles.detailCard}>
            <Ionicons name="cash-outline" size={24} color="#d24242" />
            <View style={styles.detailTextGroup}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>{event.price ? `€${event.price}` : "Free"}</Text>
            </View>
          </View>

          {event.category && (
            <View style={styles.detailCard}>
              <Ionicons name="pricetag-outline" size={24} color="#d24242" />
              <View style={styles.detailTextGroup}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{event.category}</Text>
              </View>
            </View>
          )}

          {event.attendees && (
            <View style={styles.detailCard}>
              <Ionicons name="people-outline" size={24} color="#d24242" />
              <View style={styles.detailTextGroup}>
                <Text style={styles.detailLabel}>Attendees</Text>
                <Text style={styles.detailValue}>{event.attendees} people going</Text>
              </View>
            </View>
          )}
        </Animated.View>

        <TouchableOpacity style={styles.bookButton}>
          <LinearGradient colors={["#d24242", "#ff6b6b"]} style={styles.bookButtonGradient}>
            <Text style={styles.bookButtonText}>Book Your Spot</Text>
            <Ionicons name="ticket-outline" size={24} color="#ffffff" style={styles.bookButtonIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  headerImage: {
    width: "100%",
    height: height * 0.35, // Reduced height slightly
    justifyContent: "space-between",
  },
  headerImageStyle: {
    resizeMode: "cover",
  },
  headerOverlay: {
    flex: 1,
    padding: 20,
    paddingTop: 60, // Increased top padding
    paddingBottom: 40, // Increased bottom padding to push content up
    justifyContent: "space-between",
  },
  backButtonTop: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
    // marginTop: 20, // Removed as paddingTop in headerOverlay handles it
  },
  headerContent: {
    alignItems: "flex-start",
  },
  eventTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  eventSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 24,
  },
  detailsContainer: {
    padding: 20,
    marginTop: -30, // Overlap with the image for a seamless look
    backgroundColor: "#141414",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  detailCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  detailTextGroup: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#B0B0B0",
    fontWeight: "600",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },
  detailSubValue: {
    fontSize: 14,
    color: "#E4E4E4",
    marginTop: 2,
  },
  mapIcon: {
    marginLeft: "auto",
  },
  bookButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  bookButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
  },
  bookButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  bookButtonIcon: {
    marginLeft: 5,
  },
  errorMessage: {
    color: "#ff1744",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    marginHorizontal: 50,
  },
  backButtonText: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 16,
  },
})
