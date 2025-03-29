import React from 'react';
import {StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';

const MapView: React.FC = () => {
  return (
    <MapboxGL.MapView style={styles.map}>
      <MapboxGL.Camera
        zoomLevel={12}
        centerCoordinate={[-74.00597, 40.71427]} // New York City coordinates
      />
    </MapboxGL.MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapView;
