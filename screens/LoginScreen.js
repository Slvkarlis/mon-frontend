import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8083/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Stocker token dans async storage si nécessaire
        await AsyncStorage.setItem('token', data.token);
         await AsyncStorage.setItem('role', data.user.role);
           await AsyncStorage.setItem('userId', data.user.id);
           await AsyncStorage.setItem('email', data.user.email);
           await AsyncStorage.setItem('image', data.user.image || '');

           if(data.user.role == "ADMIN"){
             Alert.alert('Connexion réussie');
            navigation.navigate('adminhome');
            
           }else if(data.user.role == "USER"){
             Alert.alert('Connexion réussie');
  navigation.navigate('home');
           }
       
         // ou une autre page else {
        Alert.alert('Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur de connexion');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎟️ andiamo</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>login</Text>
      </TouchableOpacity>
       <TouchableOpacity onPress={() => navigation.navigate('register')}>
        <Text style={styles.register}>Register new account</Text>
      </TouchableOpacity>

     
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  register: {
    color: 'black',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});