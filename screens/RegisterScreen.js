"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient" // Import LinearGradient
import API_URL from "../config/api"

const { width, height } = Dimensions.get("window")

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setEmail("")
      setPassword("")
      setName("")
      setConfirmPassword("")
      setShowPassword(false)
      setShowConfirmPassword(false)
    })

    return unsubscribe
  }, [navigation])

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name")
      return false
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address")
      return false
    }
    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long")
      return false
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match")
      return false
    }
    return true
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        Alert.alert("Registration Successful", "Your account has been created successfully. Please sign in.", [
          {
            text: "OK",
            onPress: () => {
              setEmail("")
              setPassword("")
              setName("")
              setConfirmPassword("")
              navigation.navigate("Login") // Ensure this matches your route name
            },
          },
        ])
      } else {
        Alert.alert("Registration Failed", data.message || "An error occurred during registration")
      }
    } catch (error) {
      console.error("Registration error:", error)
      Alert.alert("Connection Error", "Please check your internet connection and try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🎟️</Text>
          <Text style={styles.title}>andiamo</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#d24242" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#999"
              onChangeText={setName}
              value={name}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#d24242" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#999"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#d24242" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password (min. 6 characters)"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              value={password}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#E4E4E4" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#d24242" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirm password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#E4E4E4" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient colors={loading ? ["#666", "#666"] : ["#d24242", "#d2425a"]} style={styles.buttonGradient}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Create Account</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")} // Ensure this matches your route name
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414", // Dark background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff", // Light text
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#E4E4E4", // Lighter grey text
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a", // Darker input background
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333", // Subtle border
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000", // Keep shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    color: "#ffffff", // Light text
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden", // Needed for LinearGradient
    marginTop: 8,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#d24242", // Red shadow for button
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0, // No shadow when disabled
    elevation: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    color: "#E4E4E4", // Lighter grey text
  },
  linkTextBold: {
    color: "#d24242", // Red accent
    fontWeight: "600",
  },
})
