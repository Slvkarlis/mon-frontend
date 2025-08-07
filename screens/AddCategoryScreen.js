"use client"

import { useState } from "react"
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

export default function AddCategoryScreen({ navigation }) {
  const [name, setName] = useState("")
  const [image, setImage] = useState("") // Stores base64 string
  const [loading, setLoading] = useState(false)
  const [selectedImageUri, setSelectedImageUri] = useState(null) // Stores URI for display

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
    if (!name.trim()) {
      Alert.alert("Error", "Category name is required")
      return
    }

    setLoading(true)

    try {
      const token = await AsyncStorage.getItem("token")
      const categoryData = {
        name: name.trim(),
        image: image || null, // Send base64 string or null if no image
      }

      const response = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      Alert.alert("Success", "Category added successfully", [
        {
          text: "OK",
          onPress: () => {
            // Reset form fields after successful submission
            setName("")
            setImage("")
            setSelectedImageUri(null)
            navigation.goBack()
          },
        },
      ])
    } catch (error) {
      console.error("Error adding category:", error.message)
      Alert.alert("Error", "Unable to add category")
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

        <Text style={styles.headerTitle}>New Category</Text>

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
            <Text style={styles.sectionTitle}>Category Information</Text>

            {/* Category Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category Name *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="pricetag" size={20} color="#d24242" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter category name"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Image Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category Image</Text>
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
                    <Text style={styles.imagePickerText}>Select Category Image</Text>
                    <Text style={styles.imagePickerSubtext}>Tap to choose from gallery or camera</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
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
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={styles.submitText}>Creating...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                    <Text style={styles.submitText}>Create Category</Text>
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
