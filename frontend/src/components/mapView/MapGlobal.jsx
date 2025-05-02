import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
  PanResponder,
  FlatList,
  TextInput,
} from 'react-native';
import MapView, {Marker, Circle} from 'react-native-maps';
import {MaterialIcons, Ionicons, FontAwesome} from '@expo/vector-icons';
import listenersData from '../../data/listeners.json';

// Icon components
const MusicIcon = ({color = '#888', size = 18}) => (
  <Ionicons name="musical-note" size={size} color={color} />
);
const SettingsIcon = ({color = '#888', size = 18}) => (
  <MaterialIcons name="settings" size={size} color={color} />
);
const UserIcon = ({color = '#888', size = 18}) => (
  <FontAwesome name="user" size={size} color={color} />
);
const AddIcon = ({color = '#888', size = 18}) => (
  <Ionicons name="person-add" size={size} color={color} />
);
const SearchIcon = ({size = 24, color = '#888'}) => (
  <Ionicons name="search" size={size} color={color} />
);

const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 47 : StatusBar.currentHeight || 0;
const PURPLE = '#C04DEE';

// Slider constants
const sliderWidth = 280;
const thumbSize = 24;

const MapGlobal = ({navigation}) => {
  // State for center location
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  // Fixed radius (5km)
  const circleRadius = 5000;
  const [isMapReady, setIsMapReady] = useState(false);

  // Add search bar state and logic here
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('artists'); // 'artists' or 'songs'
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    Animated.timing(dropdownAnimation, {
      toValue: isDropdownVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const selectSearchType = type => {
    setSearchType(type);
    toggleDropdown();
  };

  // Handle map ready event
  const onMapReady = () => {
    setIsMapReady(true);
  };

  // Navigate to Settings screen
  const goToSettings = () => {
    if (navigation) {
      navigation.navigate('Settings');
    }
  };

  // Use listeners from JSON
  const musicListeners = listenersData;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Settings Button (Top right) */}
      {/* <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
        <SettingsIcon color="#fff" size={24} />
      </TouchableOpacity> */}

      {/* SEARCH BAR - TOP */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBar}>
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

      {/* Full Screen Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          onMapReady={onMapReady}>
          {/* User Location Indicator */}
          <Marker
            coordinate={location}
            title="Music Zone"
            description="Center of your music zone">
            <View style={styles.centerMarkerContainer}>
              <View style={styles.centerMarker} />
            </View>
          </Marker>

          {/* Circle showing fixed radius */}
          <Circle
            center={location}
            radius={circleRadius}
            fillColor="rgba(192, 77, 238, 0.15)"
            strokeColor="rgba(192, 77, 238, 0.5)"
            strokeWidth={2}
          />

          {/* Display music listeners from JSON */}
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

      {/* Listener Profiles Horizontal ScrollView */}
      {musicListeners.length > 0 && (
        <View style={styles.profilesContainer}>
          <FlatList
            horizontal
            data={musicListeners}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            snapToInterval={300}
            decelerationRate="fast"
            contentContainerStyle={styles.profilesContent}
            renderItem={({item}) => (
              <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileImageContainer}>
                    <UserIcon color={PURPLE} size={30} />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{item.username}</Text>
                    <Text style={styles.profileBio} numberOfLines={2}>
                      {item.bio}
                    </Text>
                  </View>
                </View>

                <View style={styles.currentlyListeningContainer}>
                  <View style={styles.listeningIcon}>
                    <MusicIcon color="#fff" size={16} />
                  </View>
                  <View style={styles.listeningInfo}>
                    <Text style={styles.listeningLabel}>
                      CURRENTLY LISTENING TO
                    </Text>
                    <Text style={styles.listeningSong}>{item.song}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.addFriendButton}>
                  <AddIcon color="#fff" size={16} />
                  <Text style={styles.addFriendText}>Add as Friend</Text>
                </TouchableOpacity>

                <View style={styles.cardIndicator}>
                  <View style={styles.cardDot} />
                  <View style={[styles.cardDot, styles.cardDotActive]} />
                  <View style={styles.cardDot} />
                </View>
              </View>
            )}
          />
        </View>
      )}
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
  centerMarkerContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerMarker: {
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
  profilesContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 10,
  },
  profilesContent: {
    paddingHorizontal: 16,
  },
  profileCard: {
    width: 300,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0e6f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  currentlyListeningContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f0ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  listeningIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  listeningInfo: {
    flex: 1,
  },
  listeningLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: PURPLE,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  listeningSong: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  addFriendButton: {
    flexDirection: 'row',
    backgroundColor: PURPLE,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addFriendText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cardDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginHorizontal: 2,
  },
  cardDotActive: {
    backgroundColor: PURPLE,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchContainer: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 20,
    left: 16,
    right: 16,
    zIndex: 20,
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
    top: 60,
    left: 0,
    right: 0,
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

export default MapGlobal;
