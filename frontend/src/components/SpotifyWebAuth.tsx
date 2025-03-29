import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator, Modal} from 'react-native';
import {WebView} from 'react-native-webview';

interface SpotifyWebAuthProps {
  onSuccess: (code: string) => void;
  onClose: () => void;
  visible: boolean;
}

const SpotifyWebAuth: React.FC<SpotifyWebAuthProps> = ({
  onSuccess,
  onClose,
  visible,
}) => {
  const [loading, setLoading] = useState(true);

  // Build the Spotify auth URL
  const clientId = 'dadc5a6001af436298cde6044d7e98fb';
  const redirectUri = 'https://crescendoweb.netlify.app/callback'; // We can use any registered URL here
  const scope = 'user-read-private user-read-email user-read-playback-state';

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&scope=${encodeURIComponent(scope)}`;

  // This function handles navigation state changes in the WebView
  const handleNavigationStateChange = (navState: any) => {
    // Check if the URL is our redirect URL
    if (navState.url.startsWith(redirectUri)) {
      // Extract the code from the URL
      const code = navState.url.split('code=')[1]?.split('&')[0];

      if (code) {
        console.log('Got auth code from webview:', code);
        onSuccess(code);
      } else {
        console.warn('No code found in redirect URL');
        onClose();
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1DB954" />
          </View>
        )}

        <WebView
          source={{uri: authUrl}}
          onNavigationStateChange={handleNavigationStateChange}
          onLoad={() => setLoading(false)}
          style={styles.webview}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
});

export default SpotifyWebAuth;
