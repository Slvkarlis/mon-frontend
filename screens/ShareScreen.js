import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Share } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export default function ShareScreen({ navigation }) {
  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Hey! Check out this awesome events app! 🎉 Join me and discover amazing parties and events in our area! Download now: [App Store Link]",
        title: "Join me on EventApp!",
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const shareOptions = [
    { id: "general", title: "Share App", icon: "share-social", color: ["#d24242", "#ff6b6b"] },
    { id: "whatsapp", title: "WhatsApp", icon: "logo-whatsapp", color: ["#25d366", "#128c7e"] },
    { id: "instagram", title: "Instagram", icon: "logo-instagram", color: ["#e4405f", "#833ab4"] },
    { id: "snapchat", title: "Snapchat", icon: "camera", color: ["#fffc00", "#fffc00"] },
  ]

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E4E4E4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share the Fun 📱</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient colors={["#d24242", "#ff6b6b"]} style={styles.heroGradient}>
            <Text style={styles.heroEmoji}>🎉</Text>
            <Text style={styles.heroTitle}>Spread the Party!</Text>
            <Text style={styles.heroSubtitle}>Invite your friends to join the most epic events in town!</Text>
          </LinearGradient>
        </View>

        {/* Referral Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Referral Stats 📊</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>👥</Text>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Friends Invited</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🎊</Text>
              <Text style={styles.statNumber}>50</Text>
              <Text style={styles.statLabel}>Bonus Points</Text>
            </View>
          </View>
        </View>

        {/* Share Options */}
        <View style={styles.shareSection}>
          <Text style={styles.sectionTitle}>Share Via 🚀</Text>
          <View style={styles.shareGrid}>
            {shareOptions.map((option) => (
              <TouchableOpacity key={option.id} style={styles.shareOption} onPress={handleShare}>
                <LinearGradient colors={option.color} style={styles.shareGradient}>
                  <Ionicons name={option.icon} size={32} color="#ffffff" />
                  <Text style={styles.shareTitle}>{option.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Referral Code */}
        <View style={styles.referralSection}>
          <Text style={styles.sectionTitle}>Your Referral Code 🎯</Text>
          <View style={styles.codeContainer}>
            <LinearGradient colors={["#2a2a2a", "#1a1a1a"]} style={styles.codeGradient}>
              <Text style={styles.codeLabel}>Share this code:</Text>
              <Text style={styles.referralCode}>PARTY2024</Text>
              <TouchableOpacity style={styles.copyButton}>
                <LinearGradient colors={["#d24242", "#ff6b6b"]} style={styles.copyGradient}>
                  <Ionicons name="copy" size={16} color="#ffffff" />
                  <Text style={styles.copyText}>Copy Code</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Rewards */}
        <View style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>Referral Rewards 🎁</Text>
          <View style={styles.rewardCard}>
            <LinearGradient colors={["#ffa726", "#ff7043"]} style={styles.rewardGradient}>
              <Text style={styles.rewardEmoji}>🎊</Text>
              <Text style={styles.rewardTitle}>Earn Points!</Text>
              <Text style={styles.rewardDescription}>Get 25 points for each friend who joins using your code!</Text>
            </LinearGradient>
          </View>

          <View style={styles.rewardCard}>
            <LinearGradient colors={["#4ecdc4", "#44a08d"]} style={styles.rewardGradient}>
              <Text style={styles.rewardEmoji}>🏆</Text>
              <Text style={styles.rewardTitle}>Unlock Badges!</Text>
              <Text style={styles.rewardDescription}>Invite 10 friends to unlock the "Social Influencer" badge!</Text>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
  },
  heroGradient: {
    padding: 30,
    alignItems: "center",
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d24242",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#E4E4E4",
    textAlign: "center",
  },
  shareSection: {
    marginBottom: 30,
  },
  shareGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  shareOption: {
    width: "47%",
    borderRadius: 15,
    overflow: "hidden",
  },
  shareGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 100,
    justifyContent: "center",
  },
  shareTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 14,
  },
  referralSection: {
    marginBottom: 30,
  },
  codeContainer: {
    borderRadius: 15,
    overflow: "hidden",
  },
  codeGradient: {
    padding: 20,
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 14,
    color: "#E4E4E4",
    marginBottom: 8,
  },
  referralCode: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d24242",
    letterSpacing: 2,
    marginBottom: 16,
  },
  copyButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  copyGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  copyText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  rewardsSection: {
    marginBottom: 40,
  },
  rewardCard: {
    marginBottom: 12,
    borderRadius: 15,
    overflow: "hidden",
  },
  rewardGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  rewardEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
    flex: 1,
  },
  rewardDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    flex: 2,
  },
})
