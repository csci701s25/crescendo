// App.tsx
import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View, Text} from 'react-native';
import SpotifyLogin from './src/components/SpotifyLogin';

function App(): React.JSX.Element {
  const [authData, setAuthData] = useState(null);

  const handleLoginSuccess = data => {
    console.log('Login successful:', data);
    setAuthData(data);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      {authData ? (
        <View style={styles.container}>
          <Text style={styles.welcomeText}>
            Welcome, {authData.profile.display_name || authData.profile.id}!
          </Text>
          <Text style={styles.infoText}>
            You're now connected to Crescendo.
          </Text>
        </View>
      ) : (
        <SpotifyLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', // Spotify-like dark background
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#b3b3b3',
    marginBottom: 40,
    textAlign: 'center',
  },
});

export default App;
