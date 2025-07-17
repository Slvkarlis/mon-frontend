import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setname] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8083/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password,name }),
        
      });

      if (response.ok) {
        console.log({ email, password,name });

        Alert.alert('Inscription réussie');
        navigation.navigate('login'); // ou vers Login si tu veux forcer la connexion après
      } else {
        Alert.alert('Erreur lors de l’inscription');
      }
    } catch (error) {
      console.error(error);
      console.log({ email, password,name });

      Alert.alert('Erreur de communication');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎟️ andiamo</Text>
          <TextInput
        style={styles.input}
        placeholder="name"
        onChangeText={setname}
        value={name}
      />

      <TextInput
        style={styles.input}
        placeholder="email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={styles.register}>Already have an account? Login</Text>
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
