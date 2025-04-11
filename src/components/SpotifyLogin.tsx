// src/components/SpotifyLogin.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

interface SpotifyLoginProps {
  onLoginSuccess: (data: any) => void;
}

const SpotifyLogin: React.FC<SpotifyLoginProps> = ({onLoginSuccess}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Set up URL handler for when Spotify redirects back
  useEffect(() => {
    // Function to handle incoming URLs
    const handleUrl = ({url}) => {
      if (url && url.includes('auth/callback')) {
        // Parse URL to get code and state
        const urlParts = url.split('?');
        if (urlParts.length < 2) return;

        const queryString = urlParts[1];
        const params = {};

        queryString.split('&').forEach(pair => {
          const [key, value] = pair.split('=');
          if (key && value) {
            params[key] = decodeURIComponent(value);
          }
        });

        const code = params['code'];
        const state = params['state'];

        if (code && state) {
          handleAuthCode(code, state);
        }
      }
    };

    // Listen for URL events (when app is opened from Spotify redirect)
    const subscription = Linking.addEventListener('url', handleUrl);

    // Check if app was opened with a URL
    Linking.getInitialURL().then(url => {
      if (url) handleUrl({url});
    });

    return () => subscription.remove();
  }, []);

  const handleAuthCode = async (code, state) => {
    setIsLoading(true);

    try {
      // Call your backend to exchange the code for a token
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/spotify/callback`,
        {
          params: {code, state},
        },
      );

      if (response.data && response.data.success) {
        const userName =
          response.data.data.profile.display_name ||
          response.data.data.profile.id;

        // Show success alert
        Alert.alert('Setup Complete', `Welcome, ${userName}!`);

        onLoginSuccess(response.data.data);
      } else {
        Alert.alert('Error', 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'Failed to authenticate with Spotify');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      // Get auth URL from your backend
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/spotify/login`,
      );

      if (response.data && response.data.url) {
        // Open the Spotify auth page in the device's browser
        await Linking.openURL(response.data.url);
      } else {
        Alert.alert('Error', 'Could not start login process');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to connect to authentication service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Crescendo</Text>
      <Text style={styles.subtitle}>
        Discover music around you in real-time
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.loginButtonText}>Login with Spotify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    marginBottom: 40,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SpotifyLogin;
