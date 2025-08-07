import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export default function AchievementsScreen({ navigation }) {
  const achievements = [
    {
      id: 1,
      title: "Party Starter",
      description: "Attended your first event",
      emoji: "🎉",
      unlocked: true,
      progress: 100,
      color: ["#ff6b6b", "#d24242"],
    },
    {
      id: 2,
      title: "Social Butterfly",
      description: "Made 5 new friends",
      emoji: "🦋",
      unlocked: true,
      progress: 100,
      color: ["#4ecdc4", "#44a08d"],
    },
    {
      id: 3,
      title: "Event Explorer",
      description: "Attended 10 different events",
      emoji: "🗺️",
      unlocked: false,
      progress: 50,
      color: ["#ffa726", "#ff7043"],
    },
    {
      id: 4,
      title: "Night Owl",
      description: "Stayed until closing at 3 events",
      emoji: "🦉",
      unlocked: false,
      progress: 33,
      color: ["#ab47bc", "#8e24aa"],
    },
    {
      id: 5,
      title: "Music Lover",
      description: "Attended 5 music events",
      emoji: "🎵",
      unlocked: false,
      progress: 80,
      color: ["#26a69a", "#00695c"],
    },
    {
      id: 6,
      title: "VIP Status",
      description: "Earned 100 points",
      emoji: "👑",
      unlocked: false,
      progress: 12,
      color: ["#ffb74d", "#ff9800"],
    },
  ]

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalPoints = 120

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E4E4E4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements 🏆</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>{totalPoints}pts</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <LinearGradient colors={["#d24242", "#ff6b6b"]} style={styles.statsGradient}>
            <Text style={styles.statsTitle}>Your Progress 🚀</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{unlockedCount}</Text>
                <Text style={styles.statLabel}>Unlocked</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{achievements.length - unlockedCount}</Text>
                <Text style={styles.statLabel}>To Go</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalPoints}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Achievements List */}
        <View style={styles.achievementsList}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <LinearGradient
                colors={achievement.unlocked ? achievement.color : ["#2a2a2a", "#1a1a1a"]}
                style={styles.achievementGradient}
              >
                <View style={styles.achievementHeader}>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
                    <View style={styles.achievementText}>
                      <Text style={[styles.achievementTitle, !achievement.unlocked && styles.lockedTitle]}>
                        {achievement.title}
                      </Text>
                      <Text style={[styles.achievementDescription, !achievement.unlocked && styles.lockedDescription]}>
                        {achievement.description}
                      </Text>
                    </View>
                  </View>
                  {achievement.unlocked ? (
                    <View style={styles.unlockedBadge}>
                      <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
                    </View>
                  ) : (
                    <View style={styles.progressContainer}>
                      <Text style={styles.progressText}>{achievement.progress}%</Text>
                    </View>
                  )}
                </View>

                {!achievement.unlocked && (
                  <View style={styles.progressBar}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${achievement.progress}%` }]} />
                    </View>
                  </View>
                )}
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Next Achievement */}
        <View style={styles.nextAchievementContainer}>
          <Text style={styles.nextTitle}>🎯 Next Achievement</Text>
          <Text style={styles.nextSubtitle}>
            You're close to unlocking "Event Explorer"! Attend 5 more events to earn it.
          </Text>
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
  pointsBadge: {
    backgroundColor: "#d24242",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pointsText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
  },
  statsGradient: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 20,
  },
  achievementsList: {
    marginBottom: 30,
  },
  achievementCard: {
    marginBottom: 16,
    borderRadius: 15,
    overflow: "hidden",
  },
  achievementGradient: {
    padding: 20,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  achievementInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  achievementEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  lockedTitle: {
    color: "#E4E4E4",
  },
  achievementDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  lockedDescription: {
    color: "#999",
  },
  unlockedBadge: {
    marginLeft: 16,
  },
  progressContainer: {
    marginLeft: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d24242",
  },
  progressBar: {
    marginTop: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#d24242",
    borderRadius: 3,
  },
  nextAchievementContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
  },
  nextTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  nextSubtitle: {
    fontSize: 14,
    color: "#E4E4E4",
    lineHeight: 20,
  },
})
