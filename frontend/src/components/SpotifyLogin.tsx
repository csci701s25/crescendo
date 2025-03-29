import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import SpotifyWebAuth from './SpotifyWebAuth'; // Import the WebView component

interface SpotifyLoginProps {
  onLoginSuccess: () => void;
}

const SpotifyLogin: React.FC<SpotifyLoginProps> = ({onLoginSuccess}) => {
  const [showWebAuth, setShowWebAuth] = useState(false);

  const handleAuthSuccess = (code: string) => {
    console.log('Authentication successful with code:', code);
    setShowWebAuth(false);

    onLoginSuccess();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Crescendo</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowWebAuth(true)}>
          <Text style={styles.buttonText}>Login with Spotify</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {marginTop: 20, backgroundColor: 'purple'}]}
          onPress={onLoginSuccess}>
          <Text style={styles.buttonText}>Skip Login (Test)</Text>
        </TouchableOpacity>
      </View>

      {/* The WebView-based auth component */}
      <SpotifyWebAuth
        visible={showWebAuth}
        onSuccess={handleAuthSuccess}
        onClose={() => setShowWebAuth(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  card: {
    padding: 32,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SpotifyLogin;
