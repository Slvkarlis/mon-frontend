import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainLayout from '../components/MainLayout';

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccessAndFetch = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('Forbidden');
          return;
        }

        const role = await AsyncStorage.getItem('role');
        if (role !== 'USER') {
          navigation.replace('Forbidden');
          return;
        }

        // Fetch events seulement si rôle USER
        const response = await fetch('http://localhost:8083/api/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur serveur : ${response.status}`);
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Erreur chargement événements :', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndFetch();
  }, []);

  if (loading) {
    return (
      <MainLayout navigation={navigation}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.container}>
        <Text style={styles.header}>Actualités</Text>
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { event: item })}>
              <View style={styles.eventCard}>
                <Image
                  source={item.image ? { uri: item.image } : require('../assets/sample-event.jpg')}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{item.name}</Text>
                  <Text style={styles.eventSubtitle}>{item.lieu?.nom || 'Lieu inconnu'}</Text>
                  <Text style={styles.eventDate}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    color: '#FFA500',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventSubtitle: {
    color: '#ccc',
    marginTop: 4,
  },
  eventDate: {
    color: '#888',
    marginTop: 4,
    fontSize: 13,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
