"use client"

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, Platform } from "react-native"
import { useNotifications } from "../contexts/NotificationContext"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function FloatingNotification() {
  const { activeNotification, hideNotification } = useNotifications()
  const slideAnim = useRef(new Animated.Value(-80)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (activeNotification) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -80,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [activeNotification])

  if (!activeNotification) return null

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity style={styles.notification} onPress={hideNotification} activeOpacity={0.9}>
        <View style={styles.iconContainer}>
          <Ionicons name="notifications" size={18} color="#d24242" />
        </View>

        <View style={styles.content}>
          <Text style={styles.message} numberOfLines={2}>
            {activeNotification.message}
          </Text>
          <Text style={styles.timestamp}>
            {activeNotification.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={hideNotification}>
          <Ionicons name="close" size={16} color="#E4E4E4" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 10,
  },
  notification: {
    backgroundColor: "#141414",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#d24242",
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#d24242",
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
    lineHeight: 16,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#E4E4E4",
    fontWeight: "500",
    lineHeight: 14,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
})
