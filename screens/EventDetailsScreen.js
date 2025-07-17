import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import MainLayout from '../components/MainLayout';

export default function EventDetailsScreen({ route, navigation }) {
  const { event } = route.params;

  const handleBuyTicket = () => {
    Alert.alert('Achat', `Ticket acheté pour "${event.name}"`);
  };

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.container}>
        {/* Image dynamique ou fallback */}
        <Image
          source={ event.image ? { uri: event.image } : require('../assets/sample-event.jpg') }
          style={styles.eventImage}
        />

        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.location}>📍 {event.location}</Text>
        <Text style={styles.date}>📅 {new Date(event.date).toLocaleString()}</Text>

        <Text style={styles.description}>
          {event.description || 'Aucune description disponible.'}
        </Text>

        <TouchableOpacity style={styles.buyButton} onPress={handleBuyTicket}>
          <Text style={styles.buyButtonText}>Acheter un ticket</Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  location: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
  },
  buyButton: {
    backgroundColor: '#d11f3e',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
