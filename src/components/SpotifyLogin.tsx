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

const SpotifyLogin = ({onLoginSuccess}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Update your SpotifyLogin.tsx useEffect for deep linking:
  useEffect(() => {
    console.log('Setting up deep linking handlers');

    // Define a single handler for deep links
    const handleDeepLink = async ({url}) => {
      if (!url) return;

      console.log('Deep link received:', url);

      if (url.includes('auth/callback')) {
        setIsLoading(true);
        try {
          // Extract code and state from URL
          const urlParts = url.split('?');
          if (urlParts.length < 2) {
            console.error('Invalid URL format:', url);
            setError('Invalid redirect URL');
            return;
          }

          const queryString = urlParts[1];
          const params = new URLSearchParams(queryString);
          const code = params.get('code');
          const state = params.get('state');

          console.log('Code and state extracted:', {
            codeExists: !!code,
            stateExists: !!state,
          });

          if (code && state) {
            console.log('Exchanging code for token');
            const response = await axios.get(
              `${API_BASE_URL}/api/auth/spotify/callback`,
              {
                params: {code, state},
              },
            );

            console.log('Response received:', response.status);

            if (response.data && response.data.success) {
              console.log('Authentication successful!');
              setUser(response.data.data.profile);
              onLoginSuccess(response.data.data);
            } else {
              console.error('Auth failed:', response.data);
              setError(
                'Authentication failed: ' +
                  (response.data.error || 'Unknown error'),
              );
            }
          } else {
            setError('Missing code or state parameters');
          }
        } catch (err) {
          console.error('Error handling auth callback:', err);
          setError('Authentication failed. Please try again. ' + err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Check if app was opened with a URL
    Linking.getInitialURL().then(url => {
      console.log('Initial URL:', url);
      if (url) handleDeepLink({url});
    });

    // Listen for deep link events while the app is running
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Clean up
    return () => subscription.remove();
  }, [onLoginSuccess]);

  const handleSpotifyLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        'Fetching auth URL from:',
        `${API_BASE_URL}/api/auth/spotify/login`,
      );
      // Get the auth URL from your backend
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/spotify/login`,
      );

      if (response.data && response.data.url) {
        console.log('Opening auth URL:', response.data.url);
        // Open the Spotify authorization page
        await Linking.openURL(response.data.url);
      } else {
        setError('Could not initiate login process');
      }
    } catch (err) {
      console.error('Error initiating Spotify login:', err);
      setError('Failed to connect to authentication service');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    Alert.alert('Error', error);
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Welcome, {user.display_name || user.id}!
        </Text>
        <Text style={styles.subtitle}>You're now connected to Spotify</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Crescendo</Text>
      <Text style={styles.subtitle}>
        Discover music around you in real-time
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSpotifyLogin}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.loginButtonText}>Login with Spotify</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.loginButton, {marginTop: 20, backgroundColor: '#666'}]}
        onPress={() => {
          const testUrl =
            'crescendo://auth/callback?code=test_code&state=test_state';
          console.log('Testing deep link with:', testUrl);
          Linking.openURL(testUrl).catch(err => {
            console.error('Failed to open test URL:', err);
            Alert.alert(
              'Deep Link Test',
              'Failed to open the test URL: ' + err.message,
            );
          });
        }}>
        <Text style={styles.loginButtonText}>Test Deep Link</Text>
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
    backgroundColor: '#121212', // Spotify-like dark background
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
    backgroundColor: '#1DB954', // Spotify green
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
