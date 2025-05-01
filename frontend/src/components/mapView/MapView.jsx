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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('artists'); // 'artists' or 'songs'
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;

  // Toggle dropdown visibility with animation
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    Animated.timing(dropdownAnimation, {
      toValue: isDropdownVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    // You could add location permissions and get user location here
    // For example, using expo-location
  }, []);

  const onMapReady = () => {
    setIsMapReady(true);
  };

  const selectSearchType = type => {
    setSearchType(type);
    toggleDropdown();
  };

  // Navigate to Settings screen
  const goToSettings = () => {
    if (navigation) {
      navigation.navigate('Settings');
    }
  };

  // Mock data for music listeners on the map
  const musicListeners = [
    {
      id: '1',
      coordinate: {latitude: 37.78925, longitude: -122.4344},
      title: 'John',
      song: 'Blinding Lights',
    },
    {
      id: '2',
      coordinate: {latitude: 37.78625, longitude: -122.4304},
      title: 'Emma',
      song: 'As It Was',
    },
    {
      id: '3',
      coordinate: {latitude: 37.78725, longitude: -122.4364},
      title: 'Mike',
      song: 'Cruel Summer',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Settings Button (Top right) */}
      <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
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
              description={`Listening to ${listener.song}`}>
              <View style={styles.listenerMarkerContainer}>
                <View style={styles.listenerMarker}>
                  <MusicIcon color="#fff" size={16} />
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Song Identifier - imported as a standalone component */}
      <SongIdentifier />

      {/* Search Bar - Positioned at the bottom */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          {/* Integrated Search Bar with Type Selector */}
          <View style={styles.searchBar}>
            {/* Type Selector - integrated left side */}
            <TouchableOpacity
              style={styles.typeSelector}
              onPress={toggleDropdown}>
              <Text style={styles.typeSelectorText}>
                {searchType === 'artists' ? 'Artists' : 'Songs'}
              </Text>
              {searchType === 'artists' ? (
                <UserIcon color="#C04DEE" size={20} />
              ) : (
                <MusicIcon color="#C04DEE" size={20} />
              )}
            </TouchableOpacity>
            <View style={styles.searchInputContainer}>
              <SearchIcon size={24} color="#888" />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${searchType}...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#888"
              />
            </View>
          </View>
        </View>

        {/* Dropdown Menu - Animated */}
        {isDropdownVisible && (
          <Animated.View
            style={[
              styles.dropdownMenu,
              {
                opacity: dropdownAnimation,
                transform: [
                  {
                    translateY: dropdownAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                searchType === 'artists' && styles.activeDropdownItem,
              ]}
              onPress={() => selectSearchType('artists')}>
              <UserIcon
                color={searchType === 'artists' ? '#C04DEE' : '#888'}
                size={24}
              />
              <Text
                style={[
                  styles.dropdownItemText,
                  searchType === 'artists' && styles.activeDropdownItemText,
                ]}>
                Artists
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                searchType === 'songs' && styles.activeDropdownItem,
              ]}
              onPress={() => selectSearchType('songs')}>
              <MusicIcon
                color={searchType === 'songs' ? '#C04DEE' : '#888'}
                size={24}
              />
              <Text
                style={[
                  styles.dropdownItemText,
                  searchType === 'songs' && styles.activeDropdownItemText,
                ]}>
                Songs
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
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
  // Search bar styling
  searchContainer: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchBarWrapper: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: 110,
  },
  typeSelectorText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    marginRight: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
    padding: 0,
    marginLeft: 10,
  },
  dropdownMenu: {
    position: 'absolute',
    bottom: 70,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  activeDropdownItem: {
    backgroundColor: '#f8f0ff',
  },
  dropdownItemText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#666',
  },
  activeDropdownItemText: {
    color: '#C04DEE',
    fontWeight: '500',
  },
});

export default MapScreen;
