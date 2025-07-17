import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ForbiddenScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚫 Accès refusé</Text>
      <Text style={styles.subText}>Vous n’avez pas la permission d’accéder à cette page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff',
    padding: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d11f3e',
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    color: '#333',
    textAlign:'center',
  },
});
