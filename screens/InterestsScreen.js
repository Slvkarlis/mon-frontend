"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export default function InterestsScreen({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState(["music", "parties", "sports"])

  const interests = [
    { id: "music", name: "Music", emoji: "🎵", color: ["#ff6b6b", "#d24242"] },
    { id: "parties", name: "Parties", emoji: "🎉", color: ["#4ecdc4", "#44a08d"] },
    { id: "sports", name: "Sports", emoji: "⚽", color: ["#ffa726", "#ff7043"] },
    { id: "gaming", name: "Gaming", emoji: "🎮", color: ["#ab47bc", "#8e24aa"] },
    { id: "food", name: "Food & Drinks", emoji: "🍕", color: ["#ff8a65", "#ff5722"] },
    { id: "art", name: "Art & Culture", emoji: "🎨", color: ["#26a69a", "#00695c"] },
    { id: "travel", name: "Travel", emoji: "✈️", color: ["#42a5f5", "#1976d2"] },
    { id: "fitness", name: "Fitness", emoji: "💪", color: ["#66bb6a", "#388e3c"] },
  ]

  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId],
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E4E4E4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Interests 🎵</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Tell us what you're into! This helps us recommend the perfect events for you 🚀
        </Text>

        {/* Selected Count */}
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{selectedInterests.length} interests selected</Text>
        </View>

        {/* Interests Grid */}
        <View style={styles.interestsGrid}>
          {interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id)
            return (
              <TouchableOpacity
                key={interest.id}
                style={styles.interestCard}
                onPress={() => toggleInterest(interest.id)}
              >
                <LinearGradient
                  colors={isSelected ? interest.color : ["#2a2a2a", "#1a1a1a"]}
                  style={styles.interestGradient}
                >
                  <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                  <Text style={[styles.interestName, isSelected && styles.selectedInterestName]}>{interest.name}</Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Based on your interests 🎯</Text>
          <View style={styles.recommendationCard}>
            <LinearGradient colors={["#d24242", "#ff6b6b"]} style={styles.recommendationGradient}>
              <Text style={styles.recommendationTitle}>Weekend Music Festival</Text>
              <Text style={styles.recommendationSubtitle}>Perfect match for Music & Parties lovers!</Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explore Event 🚀</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
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
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  saveButton: {
    backgroundColor: "#d24242",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#E4E4E4",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  countContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  countText: {
    color: "#d24242",
    fontWeight: "bold",
    fontSize: 16,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 40,
  },
  interestCard: {
    width: "47%",
    borderRadius: 15,
    overflow: "hidden",
  },
  interestGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
    position: "relative",
  },
  interestEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  interestName: {
    color: "#E4E4E4",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  selectedInterestName: {
    color: "#ffffff",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendationsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  recommendationCard: {
    borderRadius: 15,
    overflow: "hidden",
  },
  recommendationGradient: {
    padding: 20,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  recommendationSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
  },
  exploreButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  exploreButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
})
