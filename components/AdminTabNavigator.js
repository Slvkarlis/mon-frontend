"use client"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import AdminScreen from "./../screens/AdminScreen"
import ManageEventsScreen from "./../screens/ManageEventsScreen"
import ManageUsersScreen from "./../screens/ManageUsersScreen"
import CustomTabBar from "./CustomTabBar"
import AddLieuScreen from "../screens/AddLieuScreen"
import AddCategoryScreen from "../screens/AddCategoryScreen"

const Tab = createBottomTabNavigator()
export default function AdminTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminScreen}
        options={{
          tabBarLabel: "Dashboard",
        }}
      />
      <Tab.Screen
        name="ManageEvents"
        component={ManageEventsScreen}
        options={{
          tabBarLabel: "Events",
        }}
      />
      <Tab.Screen
        name="ManageUsers"
        component={ManageUsersScreen}
        options={{
          tabBarLabel: "Users",
        }}
      />
      <Tab.Screen
        name="AddCategory" // New tab screen
        component={AddCategoryScreen}
        options={{
          tabBarLabel: "Category",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="AddLieu" // New tab screen
        component={AddLieuScreen}
        options={{
          tabBarLabel: "Location",
          tabBarStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  )
}
