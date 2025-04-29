import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import SpotifyLoginButton from '../components/auth/SpotifyLoginButton';
import { SpotifyAuthData } from '../services/spotifyAuth';

const LoginScreen = () => {
  const handleLoginSuccess = (userData: SpotifyAuthData): void => {
    console.log('User logged in successfully:', userData);
    // Take the user to the home screen - probably will use react navigation or expo routing ... gotta keep researching

  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Crescendo</Text>
        <Text style={styles.subtitle}>Your music companion</Text>
        <SpotifyLoginButton onLoginSuccess={handleLoginSuccess} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1BD760', // Spotify's green
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default LoginScreen;
