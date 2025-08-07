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
  ActivityIndicator,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import API_URL from "../config/api"
import * as ImagePicker from "expo-image-picker"
import { Picker } from "@react-native-picker/picker" // Import Picker

export default function AddLieuScreen({ navigation }) {
  const [nom, setNom] = useState("")
  const [adresse, setAdresse] = useState("")
  const [image, setImage] = useState("") // Stores base64 string
  const [selectedImageUri, setSelectedImageUri] = useState(null) // Stores URI for display
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchingCategories, setFetchingCategories] = useState(true)

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCategories()
    })

    // Initial fetch when component mounts
    fetchCategories()

    return unsubscribe
  }, [navigation]) // Add navigation to dependency array

  const fetchCategories = async () => {
    try {
      setFetchingCategories(true)
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/categories`, {
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
      setCategories(data)
      if (data.length > 0) {
        setSelectedCategoryId(data[0].id) // Select first category by default
      } else {
        setSelectedCategoryId(null)
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message)
      Alert.alert("Error", "Failed to load categories")
    } finally {
      setFetchingCategories(false)
    }
  }

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
      base64: true, // Request base64
    })

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri)
      setImage(result.assets[0].base64) // Store base64
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
      base64: true, // Request base64
    })

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri)
      setImage(result.assets[0].base64) // Store base64
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
    if (!nom.trim()) {
      Alert.alert("Error", "Location name is required")
      return
    }
    if (!adresse.trim()) {
      Alert.alert("Error", "Address is required")
      return
    }
    if (!selectedCategoryId) {
      Alert.alert("Error", "Category is required")
      return
    }

    setLoading(true)

    try {
      const token = await AsyncStorage.getItem("token")
      const lieuData = {
        nom: nom.trim(),
        adresse: adresse.trim(),
        image: image || null, // Send base64 string or null if no image
        category: {
          id: selectedCategoryId,
        },
      }

      const response = await fetch(`${API_URL}/api/lieux`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lieuData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      Alert.alert("Success", "Location added successfully", [
        {
          text: "OK",
          onPress: () => {
            // Reset form fields after successful submission
            setNom("")
            setAdresse("")
            setImage("")
            setSelectedImageUri(null)
            // Re-select the first category if available, or null
            setSelectedCategoryId(categories.length > 0 ? categories[0].id : null)
            navigation.goBack()
          },
        },
      ])
    } catch (error) {
      console.error("Error adding location:", error.message)
      Alert.alert("Error", "Unable to add location")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#E4E4E4" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>New Location</Text>

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
            <Text style={styles.sectionTitle}>Location Information</Text>

            {/* Location Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location Name *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location" size={20} color="#d24242" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={nom}
                  onChangeText={setNom}
                  placeholder="Enter location name"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="map" size={20} color="#d24242" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={adresse}
                  onChangeText={setAdresse}
                  placeholder="Enter full address"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Image Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location Image</Text>
              <TouchableOpacity style={styles.imagePickerButton} onPress={showImagePicker}>
                {selectedImageUri ? (
                  <View style={styles.selectedImageContainer}>
                    <Image source={{ uri: selectedImageUri }} style={styles.selectedImage} />
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
                    <Text style={styles.imagePickerText}>Select Location Image</Text>
                    <Text style={styles.imagePickerSubtext}>Tap to choose from gallery or camera</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Category Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              {fetchingCategories ? (
                <ActivityIndicator size="small" color="#d24242" style={{ marginTop: 10 }} />
              ) : categories.length > 0 ? (
                <View style={styles.pickerContainer}>
                  <Ionicons name="pricetag" size={20} color="#d24242" style={styles.inputIcon} />
                  <Picker
                    selectedValue={selectedCategoryId}
                    onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    dropdownIconColor="#E4E4E4"
                  >
                    {categories.map((cat) => (
                      <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                    ))}
                  </Picker>
                </View>
              ) : (
                <Text style={styles.noCategoriesText}>No categories available. Please add one first.</Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading || fetchingCategories || categories.length === 0}
          >
            <LinearGradient colors={loading ? ["#666", "#666"] : ["#d24242", "#d2425a"]} style={styles.submitGradient}>
              <View style={styles.submitContent}>
                {loading ? (
                  <>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={styles.submitText}>Creating...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                    <Text style={styles.submitText}>Create Location</Text>
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
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 0, // Adjust padding for Android picker
  },
  picker: {
    flex: 1,
    color: "#ffffff",
  },
  pickerItem: {
    color: "#ffffff", // This might not work on Android directly, depends on theme
  },
  noCategoriesText: {
    color: "#E4E4E4",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
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
