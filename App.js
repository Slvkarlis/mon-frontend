import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import LieuListScreen from './screens/LieuListScreen';
import AdminScreen from './screens/AdminScreen';
import ForbiddenScreen from './screens/ForbiddenScreen';
import AddEventScreen from './screens/AddEventScreen';
import EditEventScreen from './screens/EditEventScreen';
import AdminTabNavigator from "./components/AdminTabNavigator" // Your new tab navigator

// New Profile-related screens
import FriendsScreen from './screens/FriendsScreen';
import InterestsScreen from './screens/InterestsScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import ShareScreen from './screens/ShareScreen';
import SettingsScreen from './screens/SettingsScreen';

import { useFonts } from 'expo-font';
import TabNavigator from './navigation/TabNavigator';
import ProfileScreen from './screens/ProfileScreen';
import CategoryListScreen from './screens/CategoryListScreen';

import AddCategoryScreen from './screens/AddCategoryScreen' // New import
import AddLieuScreen from './screens/AddLieuScreen' // New import

import LieuDetailsScreen from './screens/LieuDetailsScreen' // New import

import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';


const Stack = createNativeStackNavigator();

export default function App() {
  useFonts({
    Urbanist: require('./assets/fonts/Urbanist-Regular.ttf'),
  });

  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await messaging().getToken();
          console.log('📲 FCM Token:', token);

          await fetch('http://localhost:8083/api/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
        }
      } catch (err) {
        console.warn('❌ Permission or token error:', err);
      }
    };

    requestPermissionAndGetToken();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'New message'
      );
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="adminhome" component={AdminTabNavigator} />
        <Stack.Screen name="AddEvent" component={AddEventScreen} />
        <Stack.Screen name="EditEvent" component={EditEventScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="LieuListScreen" component={LieuListScreen} />
        <Stack.Screen name="Forbidden" component={ForbiddenScreen} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="Interests" component={InterestsScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
        <Stack.Screen name="Share" component={ShareScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
        <Stack.Screen name="AddLieu" component={AddLieuScreen} />
        <Stack.Screen name="LieuDetailsScreen" component={LieuDetailsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}