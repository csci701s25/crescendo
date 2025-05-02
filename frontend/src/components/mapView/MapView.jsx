import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  TextInput,
  Animated,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {MaterialIcons, FontAwesome, Ionicons} from '@expo/vector-icons';
import SongIdentifier from './SongIdentifier';
import UserProfileModal from './UserProfileModal.jsx';
import listenersData from '../../data/listeners.json';

// Replace with icon components
const UserIcon = ({color = '#888', size = 18}) => (
  <FontAwesome name="user" size={size} color={color} />
);

const MusicIcon = ({color = '#888', size = 18}) => (
  <Ionicons name="musical-note" size={size} color={color} />
);

const SearchIcon = ({color = '#888', size = 18}) => (
  <Ionicons name="search" size={size} color={color} />
);

const SettingsIcon = ({color = '#888', size = 18}) => (
  <MaterialIcons name="settings" size={size} color={color} />
);

const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 47 : StatusBar.currentHeight || 0;

const MapScreen = ({navigation}) => {
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  useEffect(() => {
    // You could add location permissions and get user location here
    // For example, using expo-location
  }, []);

  const onMapReady = () => {
    setIsMapReady(true);
  };

  // Use listeners from JSON
  const musicListeners = listenersData;

  const handleMarkerPress = user => {
    setSelectedUser(user);
    setIsProfileModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Settings Button (Top right) */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => {
          if (navigation) {
            navigation.navigate('Settings');
          }
        }}>
        <SettingsIcon color="#fff" size={24} />
      </TouchableOpacity>

      {/* Full Screen Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onMapReady={onMapReady}
          showsUserLocation
          showsMyLocationButton>
          {/* User Location Marker */}
          <Marker
            coordinate={location}
            title="You"
            description="Your current location">
            <View style={styles.markerContainer}>
              <View style={styles.marker} />
            </View>
          </Marker>

          {/* Display other music listeners */}
          {musicListeners.map(listener => (
            <Marker
              key={listener.id}
              coordinate={listener.coordinate}
              title={listener.title}
              description={`Listening to ${listener.song}`}
              onPress={() => handleMarkerPress(listener)}>
              <View style={styles.listenerMarkerContainer}>
                <View style={styles.listenerMarker}>
                  <MusicIcon color="#fff" size={16} />
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* User Profile Modal */}
      <UserProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        user={selectedUser}
      />

      {/* Song Identifier - imported as a standalone component */}
      <SongIdentifier />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
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
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#C04DEE',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  listenerMarkerContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenerMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C04DEE',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Settings button
  settingsButton: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 10,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
