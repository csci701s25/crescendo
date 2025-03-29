import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import SpotifyLogin from './frontend/src/components/SpotifyLogin';
import MapView from './frontend/src/components/MapView';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYW4xMDY1IiwiYSI6ImNtN25nbGIxNDAwemwyam9ob3NtdzdtcDkifQ.vCNExqx1YKqsExEOsUSYSw',
);

function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <SpotifyLogin onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <MapView />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
