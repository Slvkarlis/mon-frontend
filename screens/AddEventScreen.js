import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddEventScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [lieuId, setLieuId] = useState(''); // e.g. 1

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    const event = {
      name,
      description,
      image,
      date: date.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lieu: {
        id: parseInt(lieuId),
      },
    };

    try {
      const response = await fetch('http://localhost:8083/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }

      alert('Événement ajouté avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur ajout événement :', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom de l'événement</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Image (URL)</Text>
      <TextInput style={styles.input} value={image} onChangeText={setImage} />

      <Text style={styles.label}>Lieu ID</Text>
      <TextInput
        style={styles.input}
        value={lieuId}
        onChangeText={setLieuId}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Date</Text>
      <Button title={date.toLocaleString()} onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowPicker(Platform.OS === 'ios');
            setDate(currentDate);
          }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Ajouter l'événement" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#000',
    flex: 1,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
});
