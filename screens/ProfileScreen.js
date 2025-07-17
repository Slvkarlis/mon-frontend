import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainLayout from '../components/MainLayout';

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const emailStored = await AsyncStorage.getItem('email');
      const imageStored = await AsyncStorage.getItem('image');
      if (emailStored) setEmail(emailStored);
      if (imageStored) setImage(imageStored);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('image');
    Alert.alert('Déconnexion', 'Vous avez été déconnecté.');
    navigation.navigate('login');
  };

  return (
    <MainLayout navigation={navigation}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Profil</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutIcon}>⏻</Text>
          </TouchableOpacity>
        </View>

        {/* Photo de profil */}
        <View style={styles.profileContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.profilePlaceholder]}>
              <Text style={{ color: '#fff' }}>No Image</Text>
            </View>
          )}
          <TouchableOpacity style={styles.cameraIcon}>
            <Text style={{ color: '#fff', fontSize: 12 }}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* Nom */}
        <Text style={styles.name}>{email}</Text>

        {/* Cartes */}
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>👥 Mes amis</Text>
          <Text style={styles.cardSubText}>0 amis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>⚙️ Paramètres</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  logoutIcon: {
    fontSize: 20,
    color: '#fff',
  },
  profileContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  profilePlaceholder: {
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#555',
    borderRadius: 12,
    padding: 4,
  },
  name: {
    fontSize: 18,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
});
