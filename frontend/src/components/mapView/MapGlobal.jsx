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
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import MapView, {Marker, Circle} from 'react-native-maps';
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  AntDesign,
  Feather,
} from '@expo/vector-icons';
import { useUserStates } from '../../hooks/useUserStates.ts';
import listenersData from '../../data/listeners.json';
import SearchBar from './SearchBar';

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
  <AntDesign name="adduser" size={size} color={color} />
);
const ExpandIcon = ({color = '#888', size = 18}) => (
  <MaterialIcons name="expand-less" size={size} color={color} />
);
const CollapseIcon = ({color = '#888', size = 18}) => (
  <MaterialIcons name="expand-more" size={size} color={color} />
);

const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 47 : StatusBar.currentHeight || 0;

// Color scheme
const TEAL = '#39A2AE';
const DARK_GRAY = '#333333';
const MEDIUM_GRAY = '#666666';
const LIGHT_GRAY = '#F0F0F0';
const SUNSET_ORANGE = '#F3904F';

// Bottom sheet heights
const COLLAPSED_HEIGHT = height * 0.3; // 30% of screen height
const EXPANDED_HEIGHT = height * 0.7; // 70% of screen height

const MapGlobal = ({navigation, route}) => {
  const { users, me } = useUserStates('public');

  // State for center location
  const [location, setLocation] = useState({
    latitude: me?.latitude || 37.7749,
    longitude: me?.longitude || -122.4194,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Songs');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Fixed radius (5km)
  const circleRadius = 5000;
  const [isMapReady, setIsMapReady] = useState(false);

  // Bottom sheet state
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const bottomSheetHeight = useRef(
    new Animated.Value(COLLAPSED_HEIGHT),
  ).current;

  // Active card index for search results
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

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

  // Toggle bottom sheet
  const toggleBottomSheet = () => {
    const newValue = isBottomSheetExpanded ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT;

    Animated.spring(bottomSheetHeight, {
      toValue: newValue,
      useNativeDriver: false,
      friction: 8,
    }).start();

    setIsBottomSheetExpanded(!isBottomSheetExpanded);
  };

  // Filter nearby users based search based on song, artist
  // TODO: For ppl we woudl need to use current_user_states id to get the user's displayname from user_profiles table
  const filteredListeners = users.filter(listener => {
    if (!searchQuery.trim()) {
      return true;
    }
    const searchLower = searchQuery.trim().toLowerCase();

    // if (searchType === 'People') {
    //   return (
    //     (listener.title &&
    //       listener.title.toLowerCase().includes(searchLower)) ||
    //     (listener.username &&
    //       listener.username.toLowerCase().includes(searchLower))
    //   );
    // }
    if (searchType === 'Artists') {
      return (
        listener.artist_name && listener.artist_name.toLowerCase().includes(searchLower)
      );
    } else {
      return listener.song_name && listener.song_name.toLowerCase().includes(searchLower);
    }
  });

  // Handle card scroll for search results
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Search Bar - Always visible */}
      <View style={{marginTop: STATUSBAR_HEIGHT + 10, zIndex: 1000}}>

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType={searchType}
          setSearchType={setSearchType}
          isDropdownVisible={isDropdownVisible}
          setIsDropdownVisible={setIsDropdownVisible}
        />
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
            fillColor="rgba(57, 162, 174, 0.15)"
            strokeColor="rgba(57, 162, 174, 0.5)"
            strokeWidth={2}
          />

          {/* Display music listeners from JSON */}
          {filteredListeners.map(listener => (
            <Marker
              key={listener.id}
              coordinate={listener.location}
              // title={listener.display} // TODO: need info from user_profiles table
              description={`Listening to ${listener.song_name}`}>
              <View style={styles.listenerMarkerContainer}>
                <View style={styles.listenerMarker}>
                  <MusicIcon color="#fff" size={16} />
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Conditional Rendering: Show either Search Results or Bottom Sheet */}
      {searchQuery.trim() ? (
        /* SEARCH RESULTS - Full width cards when searching */
        <View style={styles.searchResultsContainer}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={filteredListeners}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({item, index}) => (
              <View style={styles.searchResultCard}>
                {/* Numerical indicator */}
                <View style={styles.indicatorContainer}>
                  <Text style={styles.indicatorText}>
                    {index + 1}/{filteredListeners.length}
                  </Text>
                </View>

                <View style={styles.cardContent}>
                  {/* User icon and name */}
                  <View style={styles.userSection}>
                    <View style={styles.profileImageContainer}>
                      <UserIcon color="#fff" size={28} />
                    </View>
                    <Text style={styles.profileName}>{item.username}</Text>
                  </View>

                  {/* Currently listening section */}
                  <View style={styles.divider} />

                  <View style={styles.listeningSection}>
                    <Text style={styles.listeningLabel}>
                      CURRENTLY LISTENING TO
                    </Text>
                    <View style={styles.songContainer}>
                      <MusicIcon color={SUNSET_ORANGE} size={20} />
                      <Text style={styles.listeningSong}>{item.song}</Text>
                    </View>
                  </View>

                  {/* Add friend button */}
                  <TouchableOpacity style={styles.addFriendButton}>
                    <AddIcon color="#fff" size={16} />
                    <Text style={styles.addFriendText}>Add as Friend</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        /* BOTTOM SHEET - Normal view with vertical list */
        <Animated.View
          style={[styles.bottomSheet, {height: bottomSheetHeight}]}>
          {/* Header with toggle button */}
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Nearby Listeners</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleBottomSheet}>
              {isBottomSheetExpanded ? (
                <CollapseIcon color={DARK_GRAY} size={24} />
              ) : (
                <ExpandIcon color={DARK_GRAY} size={24} />
              )}
            </TouchableOpacity>
          </View>

          {/* Vertical list of listeners */}
          <ScrollView style={styles.listContainer}>
            {filteredListeners.map((listener, index) => (
              <View key={listener.id} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={styles.smallProfileImage}>
                    <UserIcon color="#fff" size={18} />
                  </View>
                  <View style={styles.listItemTextContainer}>
                    {/* <Text style={styles.listItemName}>{listener.username}</Text> - need info from user_profiles table */}
                    <View style={styles.listItemSongContainer}>
                      <MusicIcon color={SUNSET_ORANGE} size={14} />
                      <Text style={styles.listItemSong} numberOfLines={1}>
                        {listener.song_name}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.listItemAddButton}>
                  <AddIcon color="#fff" size={14} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFE7',
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
    backgroundColor: SUNSET_ORANGE,
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
    backgroundColor: SUNSET_ORANGE,
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

  // BOTTOM SHEET STYLES
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F2EFE7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 10,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
  },
  toggleButton: {
    padding: 5,
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SUNSET_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
    marginBottom: 3,
  },
  listItemSongContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemSong: {
    fontSize: 13,
    color: MEDIUM_GRAY,
    marginLeft: 5,
  },
  listItemAddButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SUNSET_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // SEARCH RESULTS STYLES
  searchResultsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: height * 0.3,
    zIndex: 10,
  },
  searchResultCard: {
    width: width,
    height: '100%',
    padding: 16,
  },
  indicatorContainer: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 1,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: DARK_GRAY,
  },
  cardContent: {
    flex: 1,
    backgroundColor: '#F2EFE7',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3904F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_GRAY,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  listeningSection: {
    marginBottom: 14,
  },
  listeningLabel: {
    fontSize: 11,
    color: MEDIUM_GRAY,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listeningSong: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK_GRAY,
    marginLeft: 8,
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3904F',

    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
  },
  addFriendText: {
    color: '#F2EFE7',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
});

export default MapGlobal;
