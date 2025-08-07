"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Animated,
  TextInput,
  ScrollView,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"

import API_URL from "../config/api"

const { width, height } = Dimensions.get("window")

export default function LieuDetailsScreen({ route, navigation }) {
  const { lieuId } = route.params
  const [lieu, setLieu] = useState(null)
  const [loading, setLoading] = useState(true)

  // Reservation Form States
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedTime, setSelectedTime] = useState("") // Initialize empty, will set in useEffect
  const [numberOfPlaces, setNumberOfPlaces] = useState(2)
  const [note, setNote] = useState("")
  const [reservationStatus, setReservationStatus] = useState(null)

  // Animations (keeping for header)
  const scrollY = useRef(new Animated.Value(0)).current
  const headerOpacity = useRef(new Animated.Value(1)).current

  const totalSteps = 4

  const fetchLieuDetails = async () => {
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/lieux/${lieuId}`, {
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLieu({
          ...data,
          rating: (Math.random() * 2 + 3).toFixed(1),
          distance: `${(Math.random() * 10 + 0.5).toFixed(1)}km`,
          isOpen: Math.random() > 0.3,
          priceRange: ["€", "€€", "€€€"][Math.floor(Math.random() * 3)],
          backgroundImage: require("../assets/events.jpg"),
          followers: Math.floor(Math.random() * 1000) + 100,
          totalEvents: Math.floor(Math.random() * 50) + 10,
        })
      }
    } catch (error) {
      console.error("Error fetching lieu details:", error)
    } finally {
      setLoading(false)
    }
  }

  // Memoized function to generate time slots based on selected date
  const generateTimeSlots = useCallback((date) => {
    const slots = []
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    let startHour = 0
    let startMinute = 0

    if (isToday) {
      startHour = now.getHours()
      startMinute = now.getMinutes()
      // Round up to the next 30-minute interval
      if (startMinute < 30) {
        startMinute = 30
      } else {
        startMinute = 0
        startHour += 1
      }
    }

    for (let hour = startHour; hour < 24; hour++) {
      for (let minute = hour === startHour ? startMinute : 0; minute < 60; minute += 30) {
        const h = String(hour).padStart(2, "0")
        const m = String(minute).padStart(2, "0")
        slots.push(`${h}:${m}`)
      }
    }
    return slots
  }, [])

  // Effect to set initial time and update time slots when date changes
  useEffect(() => {
    fetchLieuDetails()
  }, [])

  useEffect(() => {
    const availableSlots = generateTimeSlots(selectedDate)
    if (availableSlots.length > 0) {
      // If current selectedTime is not in available slots or is empty, set to first available
      if (!availableSlots.includes(selectedTime)) {
        setSelectedTime(availableSlots[0])
      }
    } else {
      setSelectedTime("") // No slots available (e.g., if today and all times passed)
    }
  }, [selectedDate, generateTimeSlots]) // Re-run when selectedDate or generateTimeSlots changes

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === "ios")
    if (date) {
      setSelectedDate(date)
    }
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleReservation()
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleReservation = async () => {
    setReservationStatus(null)
    // Simulate API call
    try {
      console.log("Reservation Details:", {
        lieuId: lieu.id,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        numberOfPlaces: numberOfPlaces,
        note: note,
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))
      setReservationStatus("success")
    } catch (error) {
      console.error("Reservation failed:", error)
      setReservationStatus("error")
    }
  }

  if (loading || !lieu) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#141414" />
        <View style={styles.loadingContainer}>
          <LinearGradient colors={["#d24242", "#ff6b6b"]} style={styles.loadingGradient}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading venue details... 🏢</Text>
            <Text style={styles.loadingSubtext}>Preparing your reservation experience!</Text>
          </LinearGradient>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      {/* Venue Header */}
      <View style={styles.venueHeader}>
        <ImageBackground
          source={lieu.backgroundImage || require("../assets/events.jpg")}
          style={styles.venueHeaderImage}
          imageStyle={styles.venueHeaderImageStyle}
        >
          <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]} style={styles.venueHeaderOverlay}>
            <View style={styles.venueHeaderTop}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={styles.venueInfo}>
              <Text style={styles.venueName}>{lieu.nom}</Text>
              <Text style={styles.venueAddress}>{lieu.adresse}</Text>

              <View style={styles.venueStats}>
                <View style={styles.venueStatItem}>
                  <Ionicons name="star" size={16} color="#ffd700" />
                  <Text style={styles.venueStatText}>{lieu.rating}</Text>
                </View>
                <View style={styles.venueStatItem}>
                  <Ionicons name="location" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.venueStatText}>{lieu.distance}</Text>
                </View>
                <View style={styles.venueStatItem}>
                  <Text style={styles.venuePriceText}>{lieu.priceRange}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: lieu.isOpen ? "rgba(0, 230, 118, 0.9)" : "rgba(255, 23, 68, 0.9)" },
                  ]}
                >
                  <Text style={styles.statusText}>{lieu.isOpen ? "Open" : "Closed"}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>Make a Reservation</Text>
        <Text style={styles.stepIndicator}>
          Step {currentStep} of {totalSteps}
        </Text>

        {/* Step 1: Date Selection */}
        {currentStep === 1 && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Ionicons name="calendar-outline" size={24} color="#E4E4E4" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
        )}

        {/* Step 2: Time Selection */}
        {currentStep === 2 && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Time</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTime}
                onValueChange={(itemValue) => setSelectedTime(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {generateTimeSlots(selectedDate).map((time) => (
                  <Picker.Item key={time} label={time} value={time} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* Step 3: Number of Guests */}
        {currentStep === 3 && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number of Guests</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={numberOfPlaces}
                onValueChange={(itemValue) => setNumberOfPlaces(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <Picker.Item key={num} label={String(num)} value={num} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* Step 4: Special Note */}
        {currentStep === 4 && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Special Note (Optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="e.g., birthday celebration, specific seating request"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
            />
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.navButton} onPress={handlePreviousStep}>
              <LinearGradient colors={["#2a2a2a", "#1a1a1a"]} style={styles.navButtonGradient}>
                <Text style={styles.navButtonText}>Previous</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.navButton} onPress={handleNextStep}>
            <LinearGradient colors={["#d24242", "#ff6b6b"]} style={styles.navButtonGradient}>
              <Text style={styles.navButtonText}>{currentStep === totalSteps ? "Confirm Reservation" : "Next"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {reservationStatus === "success" && <Text style={styles.successMessage}>Reservation successful! 🎉</Text>}
        {reservationStatus === "error" && (
          <Text style={styles.errorMessage}>Reservation failed. Please try again. 😔</Text>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#141414",
    flex: 1,
  },
  venueHeader: {
    height: 280,
  },
  venueHeaderImage: {
    flex: 1,
  },
  venueHeaderImageStyle: {
    resizeMode: "cover",
  },
  venueHeaderOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  venueHeaderTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  venueInfo: {
    alignItems: "flex-start",
  },
  venueName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
  },
  venueStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  venueStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  venueStatText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "600",
  },
  venuePriceText: {
    color: "#00e676",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  stepIndicator: {
    fontSize: 16,
    color: "#B0B0B0",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#E4E4E4",
    marginBottom: 8,
    fontWeight: "600",
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  datePickerText: {
    color: "#ffffff",
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#ffffff",
  },
  pickerItem: {
    color: "#ffffff",
    fontSize: 16,
  },
  noteInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  navButton: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  navButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  navButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  successMessage: {
    marginTop: 20,
    fontSize: 16,
    color: "#00e676",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorMessage: {
    marginTop: 20,
    fontSize: 16,
    color: "#ff1744",
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingGradient: {
    borderRadius: 25,
    padding: 40,
    alignItems: "center",
    width: "100%",
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
})
