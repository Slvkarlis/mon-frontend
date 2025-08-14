import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import EventDetailsScreen from "./screens/EventDetailsScreen"
import LieuListScreen from "./screens/LieuListScreen"
import ForbiddenScreen from "./screens/ForbiddenScreen"
import AddEventScreen from "./screens/AddEventScreen"
import EditEventScreen from "./screens/EditEventScreen"
import AdminTabNavigator from "./components/AdminTabNavigator"

import FriendsScreen from "./screens/FriendsScreen"
import InterestsScreen from "./screens/InterestsScreen"
import AchievementsScreen from "./screens/AchievementsScreen"
import ShareScreen from "./screens/ShareScreen"
import SettingsScreen from "./screens/SettingsScreen"
import TabNavigator from "./navigation/TabNavigator"
import ProfileScreen from "./screens/ProfileScreen"
import CategoryListScreen from "./screens/CategoryListScreen"
import AddCategoryScreen from "./screens/AddCategoryScreen"
import AddLieuScreen from "./screens/AddLieuScreen"
import LieuDetailsScreen from "./screens/LieuDetailsScreen"

import NotificationsScreen from "./screens/NotificationScreen.js"

import { NotificationProvider } from "./contexts/NotificationContext"
import FloatingNotification from "./components/FloatingNotification"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NotificationProvider>
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
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="AddLieu" component={AddLieuScreen} />
          <Stack.Screen name="LieuDetailsScreen" component={LieuDetailsScreen} />
        </Stack.Navigator>

        <FloatingNotification />
      </NavigationContainer>
    </NotificationProvider>
  )
}
