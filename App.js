import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import LieuListScreen from './screens/LieuListScreen';
import AdminScreen from './screens/AdminScreen';
import ForbiddenScreen from './screens/ForbiddenScreen';
import AddEventScreen from './screens/AddEventScreen';
import { useFonts } from 'expo-font';

import TabNavigator from './navigation/TabNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  useFonts({
    Urbanist: require('./assets/fonts/Urbanist-Regular.ttf'),
  });

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="login">
        {/* Auth Screens */}
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
        
        {/* Main App with Tabs */}
        <Stack.Screen name="Main" component={TabNavigator} />
        
        {/* Admin Screen */}
        <Stack.Screen name="adminhome" component={AdminScreen} />
        
        {/* Modal/Detail Screens */}
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="LieuListScreen" component={LieuListScreen} />
        <Stack.Screen name="AddEvent" component={AddEventScreen} />
        <Stack.Screen name="Forbidden" component={ForbiddenScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}