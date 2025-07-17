import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 👈 import des icônes iOS/Android

export default function MainLayout({ children, navigation }) {
  return (
     <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1 }}>{children}</View>

      {/* Barre en bas */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => navigation.navigate('home')}>
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.bottomBarText}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBarItem} onPress={() => navigation.navigate('category')}>
          <Ionicons name="list-outline" size={24} color="#fff" />
          <Text style={styles.bottomBarText}>catégorie</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBarItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#fff" />
          <Text style={styles.bottomBarText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    height: 70,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  bottomBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});
