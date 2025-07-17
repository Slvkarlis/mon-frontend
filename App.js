import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import CategoryListScreen from './screens/CategoryListScreen';
import LieuListScreen from './screens/LieuListScreen';
import AdminScreen from './screens/AdminScreen';
import ForbiddenScreen from './screens/ForbiddenScreen';
import AddEventScreen from './screens/AddEventScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="adminhome" component={AdminScreen} />
         <Stack.Screen name="login" component={LoginScreen} />
           <Stack.Screen name="register" component={RegisterScreen} />
            <Stack.Screen name="EventDetails" component={EventDetailsScreen}  />
            <Stack.Screen name="Profile" component={ProfileScreen}  />
             <Stack.Screen name="category" component={CategoryListScreen}  />
               <Stack.Screen name="LieuListScreen" component={LieuListScreen}  />
                <Stack.Screen name="Forbidden" component={ForbiddenScreen} />
                <Stack.Screen name="AddEvent" component={AddEventScreen} />

             
           
      </Stack.Navigator>
    </NavigationContainer>
  );
}