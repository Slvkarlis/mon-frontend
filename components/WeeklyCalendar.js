"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"

const WeeklyCalendar = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Generate dates for the current week and next few days
  const generateWeekDates = () => {
    const dates = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 3) // Start 3 days before today

    for (let i = 0; i < 14; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const dates = generateWeekDates()

  const getDayName = (date) => {
    const days = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"]
    return days[date.getDay()]
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const handleDatePress = (date) => {
    setSelectedDate(date)
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {dates.map((date, index) => (
          <TouchableOpacity key={index} style={styles.dateItem} onPress={() => handleDatePress(date)}>
            <Text style={styles.dayText}>{getDayName(date)}</Text>
            <View
              style={[
                styles.dateCircle,
                isToday(date) && styles.todayCircle,
                isSelected(date) && styles.selectedCircle,
              ]}
            >
              <Text style={[styles.dateText, (isToday(date) || isSelected(date)) && styles.highlightedDateText]}>
                {date.getDate()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    paddingVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  dateItem: {
    alignItems: "center",
    marginRight: 20,
  },
  dayText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  todayCircle: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  selectedCircle: {
    backgroundColor: "#FF4444",
    borderColor: "#FF4444",
  },
  dateText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  highlightedDateText: {
    color: "#fff",
  },
})

export default WeeklyCalendar
