"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Image,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import API_URL from "../config/api"
import * as ImagePicker from "expo-image-picker"

export default function EditEventScreen({ navigation, route }) {
  const { event } = route.params
  const [name, setName] = useState(event.name || "")
  const [description, setDescription] = useState(event.description || "")
  const [image, setImage] = useState(event.image || "")
  const [date, setDate] = useState(new Date(event.date))
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [lieuId, setLieuId] = useState(event.lieu?.id?.toString() || "")
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    // If event has an existing image, set it up for display
    if (event.image) {
      setSelectedImage({ uri: `data:image/jpeg;base64,${event.image}` })
    }
  }, [])

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Required", "Sorry, we need camera roll permissions to select images.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0])
      setImage(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Required", "Sorry, we need camera permissions to take photos.")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0])
      setImage(result.assets[0].uri)
    }
  }

  const showImagePicker = () => {
    Alert.alert("Select Image", "Choose how you want to select an image", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Event name is required")
      return
    }

    if (!description.trim()) {
      Alert.alert("Error", "Description is required")
      return
    }

    if (!lieuId.trim()) {
      Alert.alert("Error", "Location ID is required")
      return
    }

    setLoading(true)

    try {
      const token = await AsyncStorage.getItem("token")
      const updatedEvent = {
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
        date: date.toISOString(),
        updatedAt: new Date().toISOString(),
        lieu: {
          id: Number.parseInt(lieuId),
        },
      }

      const response = await fetch(`${API_URL}/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEvent),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      Alert.alert("Success", "Event updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      console.error("Error updating event:", error.message)
      Alert.alert("Error", "Unable to update event")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#E4E4E4" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Event</Text>

        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Event Information</Text>

            {/* Event Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Name *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar" size={20} color="#d24242" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter event name"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="document-text" size={20} color="#d24242" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your event"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Image Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Image</Text>
              <TouchableOpacity style={styles.imagePickerButton} onPress={showImagePicker}>
                {selectedImage ? (
                  <View style={styles.selectedImageContainer}>
                    <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                    <View style={styles.imageOverlay}>
                      <Ionicons name="camera" size={24} color="#ffffff" />
                      <Text style={styles.imageOverlayText}>Change Image</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.imagePickerContent}>
                    <View style={styles.imagePickerIcon}>
                      <Ionicons name="camera" size={32} color="#d24242" />
                    </View>
                    <Text style={styles.imagePickerText}>Select Event Image</Text>
                    <Text style={styles.imagePickerSubtext}>Tap to choose from gallery or camera</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Lieu ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location ID *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location" size={20} color="#d24242" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={lieuId}
                  onChangeText={setLieuId}
                  placeholder="1"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Date & Time Section */}
          <View style={styles.dateTimeSection}>
            <Text style={styles.sectionTitle}>Date & Time</Text>

            <View style={styles.dateTimeGrid}>
              {/* Date Picker */}
              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
                <View style={styles.dateTimeIcon}>
                  <Ionicons name="calendar-outline" size={24} color="#d24242" />
                </View>
                <View style={styles.dateTimeInfo}>
                  <Text style={styles.dateTimeLabel}>Date</Text>
                  <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#E4E4E4" />
              </TouchableOpacity>

              {/* Time Picker */}
              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
                <View style={styles.dateTimeIcon}>
                  <Ionicons name="time-outline" size={24} color="#d24242" />
                </View>
                <View style={styles.dateTimeInfo}>
                  <Text style={styles.dateTimeLabel}>Time</Text>
                  <Text style={styles.dateTimeValue}>{formatTime(date)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#E4E4E4" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Date/Time Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date
                setShowDatePicker(Platform.OS === "ios")
                setDate(currentDate)
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date
                setShowTimePicker(Platform.OS === "ios")
                setDate(currentDate)
              }}
            />
          )}
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient colors={loading ? ["#666", "#666"] : ["#d24242", "#d2425a"]} style={styles.submitGradient}>
              <View style={styles.submitContent}>
                {loading ? (
                  <>
                    <Ionicons name="hourglass" size={20} color="#ffffff" />
                    <Text style={styles.submitText}>Updating...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                    <Text style={styles.submitText}>Update Event</Text>
                  </>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
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
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E4E4E4",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    padding: 0,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  dateTimeSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  dateTimeGrid: {
    gap: 12,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    padding: 16,
  },
  dateTimeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(210, 66, 66, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dateTimeInfo: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 14,
    color: "#E4E4E4",
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  submitSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#141414",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  submitButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#d24242",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  submitGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  imagePickerButton: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: "dashed",
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePickerContent: {
    alignItems: "center",
    padding: 20,
  },
  imagePickerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(210, 66, 66, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  imagePickerSubtext: {
    fontSize: 14,
    color: "#E4E4E4",
    textAlign: "center",
  },
  selectedImageContainer: {
    width: "100%",
    height: 120,
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  imageOverlayText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
})
