// src/screens/MapScreen.tsx
import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import MapView from '../components/MapView';

const MapScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapView />
        <View style={styles.welcomeOverlay}>
          <Text style={styles.welcomeText}>Welcome to Crescendo!</Text>
          <Text style={styles.infoText}>
            Discover music around you in real-time
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  welcomeOverlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(18, 18, 18, 0.7)',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#b3b3b3',
    textAlign: 'center',
  },
});

export default MapScreen;
