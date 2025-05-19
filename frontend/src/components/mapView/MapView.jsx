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
  ScrollView,
  FlatList,
  SafeAreaView,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Feather,
  AntDesign,
} from '@expo/vector-icons';
import SongIdentifier from './SongIdentifier';
import UserProfileModal from './UserProfileModal.jsx';
import listenersData from '../../data/listeners.json';
import {FontAwesome5} from '@expo/vector-icons';

import { useUserStates } from '../../hooks/useUserStates.ts';
import { useUserTracking } from '../../hooks/useUserTracking.ts';


// Icon components
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
const MessageIcon = ({color = '#888', size = 18}) => (
  <Feather name="message-circle" size={size} color={color} />
);
const AddIcon = ({color = '#888', size = 18}) => (
  <FontAwesome5 name="hand-point-right" size={size} color={color} />
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
const ORANGE = '#F3904F';
const DARK_GRAY = '#333333';
const MEDIUM_GRAY = '#666666';

// Bottom sheet heights
const COLLAPSED_HEIGHT = height * 0.3; // 30% of screen height
const EXPANDED_HEIGHT = height * 0.7; // 70% of screen height

const MapScreen = ({navigation}) => {

  useUserTracking(true);
  const { me, friends } = useUserStates('friends');

  const [location, setLocation] = useState({
    latitude: me?.latitude || 37.7749,
    longitude: me?.longitude || -122.4194,
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  // Friends list state
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const bottomSheetHeight = useRef(
    new Animated.Value(COLLAPSED_HEIGHT),
  ).current;
  const [friendSearchQuery, setFriendSearchQuery] = useState('');

  // Generate random distances
  const randomDistances = useRef(
    listenersData.map(() => (Math.random() * 0.9 + 0.1).toFixed(1)),
  ).current;

  useEffect(() => {}, []);

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

  const onMapReady = () => {
    setIsMapReady(true);
  };


  // Use listeners from JSON
  // [mock up, this needs to be used id @MapView.jsx]
  // Only show listeners who have '43' in their friends list
  const musicListeners = listenersData.filter(
    listener => listener.friends && listener.friends.includes('43'),
  );
  
  // Filter friends based on search
  const filteredFriends = friends.filter(listener => {
    if (!friendSearchQuery.trim()) {
      return true;
    }
    // TODO: don't have username yet!
    // return (
    //   listener.username &&
    //   listener.username.toLowerCase().includes(friendSearchQuery.toLowerCase())
    // );
  });

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

      {/* Map View - Note: not using absoluteFill anymore */}
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
          {filteredFriends.map(listener => (
            <Marker
              key={listener.id}
              coordinate={listener.location}
              // title={listener.title} // TODO: need info from user_profiles table
              description={`Listening to ${listener.song_name}`}
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

      {/* Friends Bottom Sheet*/}
      <Animated.View style={[styles.bottomSheet, {height: bottomSheetHeight}]}>
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>Friends</Text>
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

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SearchIcon color={MEDIUM_GRAY} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search friends..."
              placeholderTextColor="#999"
              value={friendSearchQuery}
              onChangeText={setFriendSearchQuery}
            />
            {friendSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setFriendSearchQuery('')}>
                <AntDesign name="close" size={16} color={MEDIUM_GRAY} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredFriends}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({item, index}) => (
            <View style={styles.friendItem}>
              <View style={styles.friendItemLeft}>
                <View style={styles.friendAvatar}>
                  <UserIcon color="#fff" size={18} />
                </View>
                <View style={styles.friendInfo}>
                  {/* <Text style={styles.friendName}>{item.username}</Text> - need info from user_profiles table */}
                  <View style={styles.friendSongContainer}>
                    <MusicIcon color={ORANGE} size={12} />
                    <Text style={styles.friendSong} numberOfLines={1}>
                      {item.song_name}
                    </Text>
                  </View>
                  <Text style={styles.distanceText}>
                    {randomDistances[index]} miles away
                  </Text>
                </View>
              </View>
              <View style={styles.friendActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageIcon color="#fff" size={14} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <AddIcon color="#fff" size={14} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </Animated.View>

      {/* User Profile Modal */}
      <UserProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        user={selectedUser}
      />

      {/* Song Identifier - imported as a standalone component */}
      {/* <SongIdentifier /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1, // Use flex instead of absoluteFill
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
    backgroundColor: ORANGE,
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
    backgroundColor: ORANGE,
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
  // Friends Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0, // Add space for tab bar
    left: 0,
    right: 0,
    backgroundColor: '#fff',
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: DARK_GRAY,
  },
  listContainer: {
    paddingBottom: 20,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  friendItemLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
    marginBottom: 3,
  },
  friendSongContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  friendSong: {
    fontSize: 13,
    color: MEDIUM_GRAY,
    marginLeft: 5,
  },
  distanceText: {
    fontSize: 12,
    color: ORANGE,
    fontWeight: '500',
  },
  friendActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default MapScreen;
