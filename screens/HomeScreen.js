"use client"

import { useEffect, useState, useMemo } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
  ImageBackground,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import API_URL from "../config/api"
import { CommonActions } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
const { width } = Dimensions.get("window")

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [notificationCount, setNotificationCount] = useState(3)
  const [calendarView, setCalendarView] = useState("compact")
  const [expandedMonths, setExpandedMonths] = useState(new Set())

  useEffect(() => {
    const checkAccessAndFetch = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        if (!token) {
          // Navigate to root stack navigator
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Forbidden" }],
            }),
          )
          return
        }

        const role = await AsyncStorage.getItem("role")
        if (role !== "USER") {
          // Navigate to root stack navigator
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Forbidden" }],
            }),
          )
          return
        }

        const email = await AsyncStorage.getItem("email")
        const image = await AsyncStorage.getItem("image")
        setUserInfo({ email, image })

        const response = await fetch(`${API_URL}/api/events`, {
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
        setEvents(data)

        if (data.length > 0) {
          const firstEventDate = new Date(data[0].date)
          setSelectedDate(firstEventDate)
        }
      } catch (error) {
        console.error("Error loading events:", error.message)
      } finally {
        setLoading(false)
      }
    }

    checkAccessAndFetch()
  }, [])

  const groupedEventDates = useMemo(() => {
    if (!events || events.length === 0) return {}

    const grouped = {}

    events.forEach((event) => {
      const eventDate = new Date(event.date)
      const monthKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}`
      const dateKey = eventDate.toDateString()

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          monthName: eventDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          dates: new Map(),
          totalEvents: 0,
        }
      }

      if (!grouped[monthKey].dates.has(dateKey)) {
        grouped[monthKey].dates.set(dateKey, {
          date: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()),
          events: [],
        })
      }

      grouped[monthKey].dates.get(dateKey).events.push(event)
      grouped[monthKey].totalEvents++
    })

    Object.keys(grouped).forEach((monthKey) => {
      grouped[monthKey].dates = Array.from(grouped[monthKey].dates.values()).sort((a, b) => a.date - b.date)
    })

    return grouped
  }, [events])

  const upcomingDates = useMemo(() => {
    const allDates = []
    Object.values(groupedEventDates).forEach((month) => {
      month.dates.forEach((dateInfo) => {
        allDates.push(dateInfo)
      })
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return allDates
      .filter((dateInfo) => {
        const eventDate = new Date(dateInfo.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate >= today
      })
      .sort((a, b) => a.date - b.date)
      .slice(0, 7)
  }, [groupedEventDates])

  const filteredEvents = events.filter((event) => {
    if (!selectedDate) return false

    const eventDate = new Date(event.date)
    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    )
  })

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const toggleMonth = (monthKey) => {
    const newExpanded = new Set(expandedMonths)
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey)
    } else {
      newExpanded.add(monthKey)
    }
    setExpandedMonths(newExpanded)
  }

  const renderCompactDateItem = ({ item }) => {
    const isSelected = selectedDate && item.date.toDateString() === selectedDate.toDateString()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const itemDate = new Date(item.date)
    itemDate.setHours(0, 0, 0, 0)
    const isToday = itemDate.getTime() === today.getTime()

    const eventCount = item.events.length

    return (
      <TouchableOpacity
        style={[
          styles.compactDateItem,
          isSelected && styles.selectedDateItem,
          isToday && !isSelected && styles.todayDateItem,
        ]}
        onPress={() => setSelectedDate(item.date)}
      >
        <Text
          style={[
            styles.compactDateNumber,
            isSelected && styles.selectedDateNumber,
            isToday && !isSelected && styles.todayDateNumber,
          ]}
        >
          {item.date.getDate()}
        </Text>
        <Text
          style={[
            styles.compactDateMonth,
            isSelected && styles.selectedDateMonth,
            isToday && !isSelected && styles.todayDateMonth,
          ]}
        >
          {item.date.toLocaleDateString("en-US", { month: "short" })}
        </Text>
        {eventCount > 1 && (
          <View style={[styles.eventCountBadge, isSelected && styles.selectedEventCountBadge]}>
            <Text style={[styles.eventCountText, isSelected && styles.selectedEventCountText]}>{eventCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  const renderMonthSection = (monthKey, monthData) => {
    const isExpanded = expandedMonths.has(monthKey)

    return (
      <View key={monthKey} style={styles.monthSection}>
        <TouchableOpacity style={styles.monthHeader} onPress={() => toggleMonth(monthKey)}>
          <Text style={styles.monthTitle}>{monthData.monthName}</Text>
          <View style={styles.monthInfo}>
            <Text style={styles.monthEventCount}>{monthData.totalEvents} events</Text>
            <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#E4E4E4" />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.monthDates}>
            <FlatList
              data={monthData.dates}
              renderItem={({ item }) => renderCompactDateItem({ item })}
              keyExtractor={(item) => item.date.toISOString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthDatesList}
            />
          </View>
        )}
      </View>
    )
  }

  const renderCalendarViewToggle = () => (
    <View style={styles.viewToggle}>
      <TouchableOpacity
        style={[styles.toggleButton, calendarView === "compact" && styles.activeToggleButton]}
        onPress={() => setCalendarView("compact")}
      >
        <Ionicons name="calendar-outline" size={16} color={calendarView === "compact" ? "#141414" : "#E4E4E4"} />
        <Text style={[styles.toggleText, calendarView === "compact" && styles.activeToggleText]}>Upcoming</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.toggleButton, calendarView === "monthly" && styles.activeToggleButton]}
        onPress={() => setCalendarView("monthly")}
      >
        <Ionicons name="list-outline" size={16} color={calendarView === "monthly" ? "#141414" : "#E4E4E4"} />
        <Text style={[styles.toggleText, calendarView === "monthly" && styles.activeToggleText]}>All Dates</Text>
      </TouchableOpacity>
    </View>
  )

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => {
        navigation.getParent()?.navigate("EventDetails", { event: item })
      }}
    >
      <ImageBackground
        source={require("../assets/sample-event.jpg")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)"]}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.gradientOverlay}
        >
          <View style={styles.eventHeader}>
            <View style={styles.eventTitleContainer}>
              <Text style={styles.eventTitle}>{item.name}</Text>
            </View>
            <View style={styles.eventBadge}>
              <Text style={styles.eventBadgeText}>📍 {item.lieu?.nom || "Location TBD"}</Text>
            </View>
          </View>

          {/* Spacer to push content to bottom */}
          <View style={{ flex: 1 }} />

          <View style={styles.eventFooter}>
            <Text style={styles.eventDetailsTitle}>Event Details</Text>

            <View style={styles.dateTimeRow}>
              <View style={styles.dateContainer}>
                <View style={styles.dateAccent}>
                  <Text style={styles.dateDay}>
                    {new Date(item.date).toLocaleDateString("en-US", { day: "numeric" })}
                  </Text>
                </View>
                <View style={styles.dateInfo}>
                  <Text style={styles.dateMonth}>
                    {new Date(item.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                  </Text>
                  <Text style={styles.dateWeekday}>
                    {new Date(item.date).toLocaleDateString("en-US", { weekday: "long" })}
                  </Text>
                </View>
              </View>

              <View style={styles.timeContainer}>
                
                <View style={styles.timeInfo}>
                  <Text style={styles.timeLabel}>TIME</Text>
                  <Text style={styles.eventTime} numberOfLines={1} adjustsFontSizeToFit>
                    {formatTime(item.date)} - {formatTime(new Date(new Date(item.date).getTime() + 2 * 60 * 60 * 1000))}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#141414" />
        <ActivityIndicator size="large" color="#d24242" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      <View style={styles.header}>
        <View style={styles.tripTitleContainer}>
          <Text style={styles.tripTitle}>Events</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#E4E4E4" />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileButton}>
            {userInfo.image ? (
              <Image source={{ uri: userInfo.image }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person" size={20} color="#141414" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.tripHeader}>
          <Text style={styles.tripSubtitle}>
            {events.length > 0 ? `${events.length} events scheduled` : "No events scheduled"}
          </Text>
        </View>

        {Object.keys(groupedEventDates).length > 0 && renderCalendarViewToggle()}

        {Object.keys(groupedEventDates).length > 0 && (
          <View style={styles.calendarSection}>
            {calendarView === "compact" ? (
              <View>
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                <FlatList
                  data={upcomingDates}
                  renderItem={renderCompactDateItem}
                  keyExtractor={(item) => item.date.toISOString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dateSelector}
                />
              </View>
            ) : (
              <View>
                <Text style={styles.sectionTitle}>All Event Dates</Text>
                {Object.entries(groupedEventDates)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([monthKey, monthData]) => renderMonthSection(monthKey, monthData))}
              </View>
            )}
          </View>
        )}

        {Object.keys(groupedEventDates).length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Ionicons name="calendar-outline" size={48} color="#666" />
            <Text style={styles.noEventsText}>No events scheduled</Text>
            <Text style={styles.noEventsSubtext}>Check back later for upcoming events</Text>
          </View>
        ) : filteredEvents.length > 0 ? (
          <View style={styles.eventsSection}>
            <Text style={styles.sectionTitle}>
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <FlatList
              data={filteredEvents}
              renderItem={renderEventCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.eventsList}
            />
          </View>
        ) : (
          selectedDate && (
            <View style={styles.noEventsContainer}>
              <Ionicons name="calendar-outline" size={48} color="#666" />
              <Text style={styles.noEventsText}>No events for this date</Text>
              <Text style={styles.noEventsSubtext}>Select another date to view events</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  loadingText: {
    color: "#E4E4E4",
    marginTop: 16,
    // fontFamily: 'Urbanist', // Commented out as font might not be loaded
    fontSize: 16,
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
  menuButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#d24242",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "#141414",
    fontSize: 12,
    fontWeight: "bold",
    // fontFamily: 'Urbanist',
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E4E4E4",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  tripHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tripTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tripTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    // fontFamily: 'Urbanist',
    marginRight: 8,
  },
  tripSubtitle: {
    fontSize: 16,
    color: "#E4E4E4",
    // fontFamily: 'Urbanist',
  },
  viewToggle: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#2a2a2a",
    borderRadius: 25,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  activeToggleButton: {
    backgroundColor: "#d24242",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E4E4E4",
    // fontFamily: 'Urbanist',
  },
  activeToggleText: {
    color: "#141414",
  },
  calendarSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    // fontFamily: 'Urbanist',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  monthSection: {
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    // fontFamily: 'Urbanist',
  },
  monthInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  monthEventCount: {
    fontSize: 14,
    color: "#E4E4E4",
    // fontFamily: 'Urbanist',
  },
  monthDates: {
    paddingHorizontal: 20,
  },
  monthDatesList: {
    paddingVertical: 8,
  },
  dateSelector: {
    paddingHorizontal: 20,
  },
  compactDateItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 80,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#d24242",
    position: "relative",
  },
  selectedDateItem: {
    backgroundColor: "#d2425a",
    borderColor: "#d24242",
  },
  todayDateItem: {
    backgroundColor: "#333",
    borderColor: "#d2425a",
  },
  compactDateNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E4E4E4",
    // fontFamily: 'Urbanist',
    marginBottom: 4,
  },
  selectedDateNumber: {
    color: "#141414",
  },
  todayDateNumber: {
    color: "#d2425a",
  },
  compactDateMonth: {
    fontSize: 12,
    color: "#999",
    // fontFamily: 'Urbanist',
  },
  selectedDateMonth: {
    color: "#141414",
  },
  todayDateMonth: {
    color: "#d2425a",
  },
  eventCountBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#d24242",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedEventCountBadge: {
    backgroundColor: "#141414",
  },
  eventCountText: {
    color: "#141414",
    fontSize: 12,
    fontWeight: "bold",
    // fontFamily: 'Urbanist',
  },
  selectedEventCountText: {
    color: "#d24242",
  },
  eventsSection: {
    marginBottom: 24,
  },
  eventsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  eventCard: {
    marginHorizontal: 0, // Removed horizontal margin here
    marginVertical: 10,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 280, // Fixed height to ensure all content fits
    width: width - 40, // Set width to screen width minus horizontal padding
    alignSelf: "center", // Center the card
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  backgroundImageStyle: {
    resizeMode: "cover",
  },
  gradientOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10, // Adjusted margin
  },
  eventTitleContainer: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    // fontFamily: 'Urbanist',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 16,
    color: "#E4E4E4",
    // fontFamily: 'Urbanist',
  },
  eventBadge: {
    backgroundColor: "#d24242",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventBadgeText: {
    color: "#141414",
    fontSize: 12,
    fontWeight: "bold",
    // fontFamily: 'Urbanist',
  },
  eventDetails: {
    // This section is now removed from the JSX
  },
  eventDetailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    // fontFamily: 'Urbanist',
    marginBottom: 4,
  },
  eventDetailsSubtitle: {
    fontSize: 14,
    color: "#E4E4E4",
    // fontFamily: 'Urbanist',
    flex: 1, // Allow it to take available space
    textAlign: "right", // Align to right
  },
  eventFooter: {
    // This is the main footer container
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)", // Lighter border
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // Align items to the bottom
    marginTop: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Allow it to take space
  },
  dateAccent: {
    backgroundColor: "#d24242",
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#d24242",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  dateInfo: {
    // No flex: 1 here, let content define width
  },
  dateMonth: {
    fontSize: 14,
    fontWeight: "700",
    color: "#d24242",
    letterSpacing: 1,
  },
  dateWeekday: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    marginTop: 2,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Allow it to take space
    justifyContent: "flex-end", // Push content to the right
  },
  timeAccent: {
    backgroundColor: "#d24242",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#d24242",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  timeIcon: {
    fontSize: 18,
  },
  timeInfo: {
    // No flex: 1 here, let content define width
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#d24242",
    letterSpacing: 1,
    marginBottom: 2,
    textAlign: "right", // Align label to right
  },
  eventTime: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "right", // Align time to right
  },
  eventCode: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  eventCodeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    // fontFamily: 'Urbanist',
  },
  eventRoute: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  routeText: {
    color: "#E4E4E4",
    fontSize: 16,
    fontWeight: "bold",
    // fontFamily: 'Urbanist',
  },
  planeIcon: {
    transform: [{ rotate: "90deg" }],
  },
  noEventsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noEventsText: {
    fontSize: 18,
    color: "#E4E4E4",
    // fontFamily: 'Urbanist',
    marginTop: 16,
    marginBottom: 8,
  },
  noEventsSubtext: {
    fontSize: 14,
    color: "#999",
    // fontFamily: 'Urbanist',
    textAlign: "center",
  },
})
