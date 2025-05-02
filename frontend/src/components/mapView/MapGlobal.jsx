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
} from 'react-native';
import MapView, {Marker, Circle} from 'react-native-maps';
import {MaterialIcons, Ionicons, FontAwesome} from '@expo/vector-icons';

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

  // State for radius control
  const [radius, setRadius] = useState(3); // Initial value, scale 1-6
  const [circleRadius, setCircleRadius] = useState(9000); // Initial radius in meters
  const [isMapReady, setIsMapReady] = useState(false);

  // Slider position state
  const [sliderPosition, setSliderPosition] = useState(
    ((radius - 1) * (sliderWidth - thumbSize)) / 5,
  );

  // Update when radius changes
  useEffect(() => {
    setSliderPosition(((radius - 1) * (sliderWidth - thumbSize)) / 5);
  }, [radius]);

  // Create pan responder for the slider
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gestureState) => {
        let newPosition = gestureState.moveX - 50; // Adjust based on container position

        // Keep within bounds
        if (newPosition < 0) newPosition = 0;
        if (newPosition > sliderWidth - thumbSize)
          newPosition = sliderWidth - thumbSize;

        setSliderPosition(newPosition);

        // Calculate new radius based on position
        const segmentWidth = (sliderWidth - thumbSize) / 5;
        const newRadius = Math.min(
          Math.max(Math.round(newPosition / segmentWidth) + 1, 1),
          6,
        );

        if (newRadius !== radius) {
          // Update radius
          updateRadius(newRadius);
        }
      },
      onPanResponderRelease: () => {},
    }),
  ).current;

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

  // Update circle radius based on slider value
  const updateRadius = newRadius => {
    setRadius(newRadius);
    // Convert radius value (1-6) to an actual map radius (in meters)
    setCircleRadius(newRadius * 3000); // 3km to 18km
  };

  // Calculate how many music symbols to show based on radius
  const getMusicListeners = () => {
    // Generate random music listeners around the center point
    // Number of listeners increases with radius
    const numberOfListeners = Math.min(Math.floor(radius), 6);
    const listeners = [];

    // Generate fixed positions based on radius value
    for (let i = 0; i < numberOfListeners; i++) {
      // Calculate position in a circular pattern around the center
      const angle = (i / numberOfListeners) * Math.PI * 2;
      const radiusFactor = circleRadius * 0.2; // Keep inside the circle

      const lat = location.latitude + Math.cos(angle) * (radiusFactor / 111300);
      const lng =
        location.longitude +
        Math.sin(angle) *
          (radiusFactor /
            (111300 * Math.cos(location.latitude * (Math.PI / 180))));

      listeners.push({
        id: `global-${i}`,
        coordinate: {latitude: lat, longitude: lng},
        title: `Music Listener ${i + 1}`,
      });
    }

    return listeners;
  };

  // Get music listeners based on current radius
  const musicListeners = getMusicListeners();

  // Sample music listener profiles (one for each potential listener)
  const [listenerProfiles] = useState([
    {
      id: 'global-0',
      name: 'Ayman Khan',
      bio: 'Music lover from Bronx. Always on the lookout for new indie bands.',
      song: 'As It Was',
      artist: 'Harry Styles',
      image: null,
    },
    {
      id: 'global-1',
      name: 'Hedavam Solano',
      bio: 'Electronic music producer and DJ. Sharing my favorite tracks while working on new material.',
      song: 'Blinding Lights',
      artist: 'The Weeknd',
      image: null,
    },
    {
      id: 'global-2',
      name: 'An Adhikari',
      bio: 'Guitaris with a love for rock.',
      song: 'Bad Habit',
      artist: 'Steve Lacy',
      image: null,
    },
    {
      id: 'global-3',
      name: 'James Miller',
      bio: 'Rock and metal enthusiast. Guitarist in a local band. Always on tour.',
      song: 'Master of Puppets',
      artist: 'Metallica',
      image: null,
    },
    {
      id: 'global-4',
      name: 'Olivia Parker',
      bio: 'Jazz vocalist and vinyl collector. I appreciate the classics and modern interpretations.',
      song: 'Take Five',
      artist: 'Dave Brubeck',
      image: null,
    },
    {
      id: 'global-5',
      name: 'Liam Johnson',
      bio: 'Hip hop producer and beatmaker. Sharing my inspirations and current projects.',
      song: 'SICKO MODE',
      artist: 'Travis Scott',
      image: null,
    },
  ]);

  // Get visible listeners based on radius
  const visibleProfiles = listenerProfiles.slice(0, musicListeners.length);

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

      {/* Custom Radius Slider (Top) */}
      <View style={styles.radiusContainer}>
        <Text style={styles.radiusLabel}>
          Radius: {Math.round(circleRadius / 1000)} km
        </Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                {width: sliderPosition + thumbSize / 2},
              ]}
            />
          </View>
          <Animated.View
            style={[styles.sliderThumb, {left: sliderPosition}]}
            {...panResponder.panHandlers}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>1</Text>
            <Text style={styles.sliderLabelText}>2</Text>
            <Text style={styles.sliderLabelText}>3</Text>
            <Text style={styles.sliderLabelText}>4</Text>
            <Text style={styles.sliderLabelText}>5</Text>
            <Text style={styles.sliderLabelText}>6</Text>
          </View>
        </View>
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

          {/* Circle showing radius */}
          <Circle
            center={location}
            radius={circleRadius}
            fillColor="rgba(192, 77, 238, 0.15)"
            strokeColor="rgba(192, 77, 238, 0.5)"
            strokeWidth={2}
          />

          {/* Display music listeners */}
          {musicListeners.map(listener => (
            <Marker
              key={listener.id}
              coordinate={listener.coordinate}
              title={listener.title}>
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
            data={visibleProfiles}
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
                    <Text style={styles.profileName}>{item.name}</Text>
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
                    <Text style={styles.listeningArtist}>{item.artist}</Text>
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
  radiusContainer: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 10,
    left: 16,
    right: 76, // Make room for settings button
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  radiusLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    width: sliderWidth,
    alignSelf: 'center',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    width: sliderWidth,
  },
  sliderFill: {
    height: 6,
    backgroundColor: PURPLE,
    borderRadius: 3,
  },
  sliderThumb: {
    width: thumbSize,
    height: thumbSize,
    borderRadius: thumbSize / 2,
    backgroundColor: PURPLE,
    position: 'absolute',
    top: 8,
    marginTop: -thumbSize / 2 + 3,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: sliderWidth,
    marginTop: 5,
  },
  sliderLabelText: {
    fontSize: 10,
    color: '#555',
    width: 16,
    textAlign: 'center',
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
  listeningArtist: {
    fontSize: 12,
    color: '#666',
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
});

export default MapGlobal;
