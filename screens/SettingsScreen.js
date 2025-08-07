import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [friendRequests, setFriendRequests] = useState(true);
  const [locationServices, setLocationServices] = useState(false);

  const settingsGroups = [
    {
      title: 'Notifications 🔔',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Get notified about new events',
          type: 'switch',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'eventReminders',
          title: 'Event Reminders',
          subtitle: 'Remind me before events start',
          type: 'switch',
          value: eventReminders,
          onToggle: setEventReminders,
        },
        {
          id: 'friendRequests',
          title: 'Friend Requests',
          subtitle: 'Get notified about new friend requests',
          type: 'switch',
          value: friendRequests,
          onToggle: setFriendRequests,
        },
      ],
    },
    {
      title: 'Privacy & Security 🔒',
      items: [
        {
          id: 'locationServices',
          title: 'Location Services',
          subtitle: 'Help find events near you',
          type: 'switch',
          value: locationServices,
          onToggle: setLocationServices,
        },
        {
          id: 'profileVisibility',
          title: 'Profile Visibility',
          subtitle: 'Who can see your profile',
          type: 'navigation',
          value: 'Friends Only',
        },
        {
          id: 'dataPrivacy',
          title: 'Data & Privacy',
          subtitle: 'Manage your data preferences',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'Account 👤',
      items: [
        {
          id: 'editProfile',
          title: 'Edit Profile',
          subtitle: 'Update your information',
          type: 'navigation',
        },
        {
          id: 'changePassword',
          title: 'Change Password',
          subtitle: 'Update your password',
          type: 'navigation',
        },
        {
          id: 'deleteAccount',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          type: 'navigation',
          danger: true,
        },
      ],
    },
    {
      title: 'Support 💬',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          subtitle: 'Get help and support',
          type: 'navigation',
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          type: 'navigation',
        },
        {
          id: 'about',
          title: 'About',
          subtitle: 'App version and info',
          type: 'navigation',
        },
      ],
    },
  ];

  const renderSettingItem = (item) => {
    return (
      <View key={item.id} style={styles.settingItem}>
        <LinearGradient
          colors={['#2a2a2a', '#1a1a1a']}
          style={styles.settingGradient}
        >
          <View style={styles.settingContent}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, item.danger && styles.dangerText]}>
                {item.title}
              </Text>
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              {item.type === 'navigation' && item.value && (
                <Text style={styles.settingValue}>{item.value}</Text>
              )}
            </View>
            
            {item.type === 'switch' ? (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: '#444', true: '#d24242' }}
                thumbColor={item.value ? '#ffffff' : '#999'}
              />
            ) : (
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={item.danger ? '#ff4444' : '#E4E4E4'} 
              />
            )}
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141414" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E4E4E4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings ⚙️</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <LinearGradient
            colors={['#d24242', '#ff6b6b']}
            style={styles.userGradient}
          >
            <View style={styles.userInfo}>
              <Text style={styles.userEmoji}>🎭</Text>
              <View>
                <Text style={styles.userName}>Party Lover</Text>
                <Text style={styles.userEmail}>user@example.com</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#ffffff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, index) => (
          <View key={index} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map(renderSettingItem)}
          </View>
        ))}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>EventApp v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for party lovers</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editButton: {
    padding: 8,
  },
  settingsGroup: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 12,
    borderRadius: 15,
    overflow: 'hidden',
  },
  settingGradient: {
    padding: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  dangerText: {
    color: '#ff4444',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#E4E4E4',
  },
  settingValue: {
    fontSize: 12,
    color: '#d24242',
    marginTop: 4,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});