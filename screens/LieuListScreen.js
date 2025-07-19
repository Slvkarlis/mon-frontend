import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainLayout from '../components/MainLayout'; // adapte selon ta structure
import API_URL from '../config/api';

export default function LieuListScreen({ route, navigation }) {
  const { categoryId } = route.params;
  const [lieux, setLieux] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLieux = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/lieux/by-category/${categoryId}`, {
        headers: {
          'Accept': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLieux(data);
      } else {
        alert(`Erreur ${response.status} lors du chargement des lieux`);
      }
    } catch (error) {
      alert('Erreur réseau, vérifiez votre connexion');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLieux();
  }, []);

  const renderLieu = ({ item }) => (
    <TouchableOpacity
      style={styles.lieuCard}
      onPress={() => navigation.navigate('LieuDetailsScreen', { lieuId: item.id })}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.lieuImage} resizeMode="cover" />
      ) : (
        <View style={[styles.lieuImage, styles.noImage]}>
          <Text style={styles.noImageText}>Pas d'image</Text>
        </View>
      )}
      <View style={styles.lieuInfo}>
        <Text style={styles.lieuNom}>{item.nom}</Text>
        <Text style={styles.lieuAdresse}>{item.adresse}</Text>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.header}>Lieux</Text>
        {lieux.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Aucun lieu trouvé pour cette catégorie.</Text>
          </View>
        ) : (
          <FlatList
            data={lieux}
            renderItem={renderLieu}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
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
  lieuCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    justifyContent: 'center',
  },
  lieuImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  noImage: {
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#aaa',
    fontStyle: 'italic',
  },
  lieuInfo: {},
  lieuNom: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lieuAdresse: {
    color: '#ccc',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
