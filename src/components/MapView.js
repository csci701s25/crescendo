import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

// You'll need to replace this with your actual Mapbox token
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYW4xMDY1IiwiYSI6ImNtN25nbGIxNDAwemwyam9ob3NtdzdtcDkifQ.vCNExqx1YKqsExEOsUSYSw',
);

const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0;

const MapView = ({navigation}) => {
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // Initialize map settings
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  const onMapReady = () => {
    setIsMapReady(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={[styles.header, {marginTop: STATUSBAR_HEIGHT}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crescendo Map</Text>
      </View>

      {/* MapBox Container */}
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Street}
          zoomLevel={14}
          onDidFinishLoadingMap={onMapReady}
          compassEnabled
          logoEnabled={false}>
          <MapboxGL.Camera
            zoomLevel={14}
            centerCoordinate={[location.longitude, location.latitude]}
            animationDuration={0}
          />

          {/* User Location Marker */}
          <MapboxGL.PointAnnotation
            id="userLocation"
            coordinate={[location.longitude, location.latitude]}>
            <View style={styles.markerContainer}>
              <View style={styles.marker} />
            </View>
          </MapboxGL.PointAnnotation>
        </MapboxGL.MapView>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.findButton}>
          <Text style={styles.findButtonText}>Find Artists Near Me</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Complete Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    zIndex: 10,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: '#C04DEE',
    borderWidth: 2,
    borderColor: 'white',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
  },
  findButton: {
    backgroundColor: '#C04DEE', // Purple to match Crescendo theme
    borderRadius: 30,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  findButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    borderColor: '#C04DEE',
    borderWidth: 1,
    borderRadius: 30,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  profileButtonText: {
    color: '#C04DEE',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapView;
