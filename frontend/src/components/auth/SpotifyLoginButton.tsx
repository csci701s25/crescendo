import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { authService, SpotifyAuthData } from '../../services/spotifyAuth';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';


// Guide - Expo Spotify OAuth: https://docs.expo.dev/guides/authentication/#spotify

WebBrowser.maybeCompleteAuthSession();

// Define Spotify OAuth endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const CLIENT_ID = 'ac244bca6e2940e4bc0fd936c2f537af';

interface SpotifyLoginButtonProps {
  onLoginSuccess?: (userData: SpotifyAuthData) => void; // Optional prop - look into silent auth flows
}

const SpotifyLoginButton = ({ onLoginSuccess }: SpotifyLoginButtonProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  // Configure auth request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [
        // user info
        'user-read-private', // Account type - subscription details
        'user-read-email',

        // playback
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',

        // listening history
        'user-read-recently-played',
        'user-top-read',

        // access/modify library
        'user-library-read',
        'user-library-modify',

        // access/modify playlists
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-private',
        'playlist-modify-public',

        // access to follow
        'user-follow-read',
      ],
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: 'crescendo',
        path: 'auth/callback',
      }),
    },
    discovery
  );

  //print redirect uri
  const redirectUri = makeRedirectUri({
    scheme: 'crescendo',
    path: 'auth/callback',
  });
  console.log('Redirect URI:', redirectUri);

  // Handle authentication response - wait for code from Spotify, then use code to get refresh token
  const handleAuthCode = useCallback(async (code: string) => { // useCallback to prevent re-rendering since useEffect depends on this handler - https://www.reddit.com/r/reactjs/comments/snek8b/why_memoize_functions_with_reactusecallback/
    try {
      setLoading(true);
      const authResponse = await authService.handleSpotifyCallback(code);

      if (authResponse && authResponse.success) {
        // TODO: Use redux for global state management
        const { tokens, tokenExpiresAt, profile } = authResponse.data;

        await SecureStore.setItemAsync('id', authResponse.data.id);
        await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
        await SecureStore.setItemAsync('accessToken', tokens.accessToken);
        await SecureStore.setItemAsync('tokenExpiresAt', tokenExpiresAt);
        await SecureStore.setItemAsync('userProfile', JSON.stringify(profile));

        if (onLoginSuccess) {
          onLoginSuccess(authResponse.data);
        }
      } else {
        Alert.alert('Error', 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      Alert.alert('Error', 'Authentication process failed');
    } finally {
      setLoading(false);
    }
  }, [onLoginSuccess]);


  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('Received code:', code);
      handleAuthCode(code);
    }
  }, [response, handleAuthCode]);

const handleLogin = useCallback(() => {
  promptAsync();
}, [promptAsync]);

  return (
    <View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={!request || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Login with Spotify'}
        </Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1BD760" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#1BD760',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default SpotifyLoginButton;
