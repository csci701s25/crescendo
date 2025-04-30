import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import SpotifyLoginButton from '../components/auth/SpotifyLoginButton';
import {SpotifyAuthData} from '../services/spotifyAuth';

const LoginScreen = ({navigation}) => {
  // Spotify login handler
  const handleLoginSuccess = (userData: SpotifyAuthData) => {
    console.log('User logged in successfully:', userData);
    if (navigation) {
      navigation.navigate('MapView');
    }
  };

  // Handler for Skip button
  const handleSkip = () => {
    console.log('Navigating to MapView');
    if (navigation) {
      navigation.navigate('MapView');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Skip button at top right */}
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main content with concentric circles, logo, and text */}
      <View style={styles.contentContainer}>
        <View style={styles.circlesContainer}>
          {/* Render concentric circles */}
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.circle,
                {
                  width: 400 - i * 50,
                  height: 400 - i * 50,
                  opacity: 0.1 + i * 0.02,
                },
              ]}
            />
          ))}

          {/* App name */}
          <Text style={styles.appName}>Crescendo</Text>
        </View>

        {/* Subtitle text */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Hear What the World is Playing</Text>
          <Text style={styles.subtitleText}>
            Description of the app - lorem ipsum lorem ipsum lorem ipsum lorem
          </Text>
        </View>
      </View>

      {/* Bottom section with buttons */}
      <View style={styles.buttonSection}>
        {/* Connect button (Spotify) */}
        <SpotifyLoginButton onLoginSuccess={handleLoginSuccess} />
        {/* Skip for now text */}
        <TouchableOpacity onPress={handleSkip} style={styles.skipButtonBottom}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  skipContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  circlesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 60,
  },
  circle: {
    position: 'absolute',
    borderRadius: 200,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginTop: 0,
    zIndex: 2,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 150,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonSection: {
    marginBottom: 50,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  skipButtonBottom: {
    padding: 10,
  },
  skipButtonText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
});

export default LoginScreen;
