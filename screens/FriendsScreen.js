"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export default function FriendsScreen({ navigation }) {
  const [searchText, setSearchText] = useState("")
  const [friends] = useState([
    { id: 1, name: "Alex Party", status: "online", avatar: "🎉", mutualEvents: 3 },
    { id: 2, name: "Sarah Beats", status: "offline", avatar: "🎵", mutualEvents: 7 },
    { id: 3, name: "Mike Vibes", status: "online", avatar: "🕺", mutualEvents: 2 },
  ])

  const [suggestions] = useState([
    { id: 4, name: "Emma Dance", avatar: "💃", mutualFriends: 2 },
    { id: 5, name: "Jake Music", avatar: "🎸", mutualFriends: 5 },
  ])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E4E4E4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Squad 👥</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add" size={24} color="#E4E4E4" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>🔥 {friends.length}</Text>
            <Text style={styles.statLabel}>Squad Members</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>🎊 12</Text>
            <Text style={styles.statLabel}>Events Together</Text>
          </View>
        </View>

        {/* Friends List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Squad</Text>
          {friends.map((friend) => (
            <TouchableOpacity key={friend.id} style={styles.friendCard}>
              <LinearGradient colors={["#2a2a2a", "#1a1a1a"]} style={styles.friendGradient}>
                <View style={styles.friendInfo}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.friendAvatar}>{friend.avatar}</Text>
                    <View style={[styles.statusDot, friend.status === "online" ? styles.online : styles.offline]} />
                  </View>
                  <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendStatus}>{friend.mutualEvents} events together 🎉</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.messageButton}>
                  <Ionicons name="chatbubble" size={20} color="#d24242" />
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>People You Might Know</Text>
          {suggestions.map((person) => (
            <TouchableOpacity key={person.id} style={styles.friendCard}>
              <LinearGradient colors={["#2a2a2a", "#1a1a1a"]} style={styles.friendGradient}>
                <View style={styles.friendInfo}>
                  <Text style={styles.friendAvatar}>{person.avatar}</Text>
                  <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>{person.name}</Text>
                    <Text style={styles.friendStatus}>{person.mutualFriends} mutual friends</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.addFriendButton}>
                  <LinearGradient colors={["#d24242", "#ff6b6b"]} style={styles.addButtonGradient}>
                    <Ionicons name="person-add" size={16} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          ))}
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    paddingVertical: 12,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#E4E4E4",
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  friendCard: {
    marginBottom: 12,
    borderRadius: 15,
    overflow: "hidden",
  },
  friendGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  friendAvatar: {
    fontSize: 32,
  },
  statusDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  online: {
    backgroundColor: "#4CAF50",
  },
  offline: {
    backgroundColor: "#666",
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 14,
    color: "#E4E4E4",
  },
  messageButton: {
    padding: 8,
  },
  addFriendButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  addButtonGradient: {
    padding: 8,
  },
})
