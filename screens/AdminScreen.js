import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminScreen({ navigation }) {
  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem('role');
      if (role !== 'ADMIN') {
        navigation.replace('Forbidden');
      }
    };
    checkRole();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenue Admin 👋</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddEvent')}
      >
        <Text style={styles.buttonText}>➕ Ajouter un événement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Fond noir
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
