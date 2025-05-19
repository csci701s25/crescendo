import React, {useState, useRef, useEffect} from 'react';
import {userProfileService} from '../../services/userProfileService';
import * as SecureStore from 'expo-secure-store';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Animated,
  Platform,
  Dimensions,
  Easing,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0;
const PURPLE = '#C04DEE';
const CARD_BG = 'rgba(255, 255, 255, 0.9)';
const SECTION_BG = 'rgba(255, 255, 255, 0.7)';

const Settings = ({navigation}) => {
  // Animation values for circles
  const circleAnim1 = useRef(new Animated.Value(0)).current;
  const circleAnim2 = useRef(new Animated.Value(0)).current;
  const circleAnim3 = useRef(new Animated.Value(0)).current;

  // Card animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  // User data state
  const [userData, setUserData] = useState({
    name: 'An',
    bio: 'Love GnR, lately been listening to Bruce Springsteen.',
    followers: '1,065',
    artist: 'Guns and Roses',
    album: 'Apetite for Destruction',
    song: 'Paradise City',
    locationVisibility: 'Friends only',
  });

  // Editing states
  const [isEditing, setIsEditing] = useState({
    display_name: false,
    bio: false,
    favorite_artist: false,
    favorite_album: false,
    favorite_song: false,
  });

  // Modal visibility state
  const [visibilityModalVisible, setVisibilityModalVisible] = useState(false);

  // Visibility options
  const visibilityOptions = ['Everyone', 'Friends only', 'Nobody'];

  // Fetch user profile from DB - only after user has logged in and completed profile setup
  useEffect(() => {
    const fetchProfile = async () => {
      const userProfileStr = await SecureStore.getItemAsync('userProfile');
      if (!userProfileStr) {
        return;
      }
      // Since we store userProfile as a string in SecureStore
      const userProfile = JSON.parse(userProfileStr);

      const user_id = await SecureStore.getItemAsync('id');
      console.log('User id:', user_id);

      // Preset profile image and display name from Spotify profile
      setUserData(prev => ({
        ...prev,
        user_id,
        profile_image_url: userProfile.profile_image_url || '',
        display_name: userProfile.display_name || '',
      }));

      // Fetch follower and following counts from DB!
      const followers = await userProfileService.getFollowers(user_id);
      const following = await userProfileService.getFollowing(user_id);

      const profile = await userProfileService.getUserProfile(user_id);
      if (profile) {
        console.log('Profile found for user:', user_id);
        console.log('Profile:', profile);
        setUserData({
          user_id: userData.user_id,
          display_name: profile.display_name || '',
          bio: profile.bio || '',
          profile_image_url: profile.profile_image_url || '',
          followers: followers.count,
          following: following.count,
          favorite_artist: profile.favorite_artist || '',
          favorite_album: profile.favorite_album || '',
          favorite_song: profile.favorite_song || '',
          privacy_level:
            profile.privacy_level === 'everyone'
              ? 'Everyone'
              : profile.privacy_level === 'nobody'
              ? 'Nobody'
              : 'Friends only',
        });
      } else {
        console.log('No profile found for user:', user_id);
      }
    };
    fetchProfile();
  }, [userData.user_id]);

  // Animation on component mount
  useEffect(() => {
    // Card entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Background circles animation
    Animated.loop(
      Animated.timing(circleAnim1, {
        toValue: 1,
        duration: 20000, // 20 seconds for one full cycle
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();

    Animated.loop(
      Animated.timing(circleAnim2, {
        toValue: 1,
        duration: 25000, // 25 seconds for one full cycle
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();

    Animated.loop(
      Animated.timing(circleAnim3, {
        toValue: 1,
        duration: 18000, // 18 seconds for one full cycle
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, [fadeAnim, translateY]);

  // Handle text input changes
  const handleChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  // Create or Update new user profile in DB
  const handleSaveProfile = async () => {
    try {
      console.log('Upserting profile for user:', userData.user_id);
      console.log('User data:', userData);
      const profileData = {
        id: userData.user_id,
        profile_image_url: userData.profile_image_url,
        display_name: userData.display_name,
        bio: userData.bio,
        favorite_artist: userData.favorite_artist,
        favorite_album: userData.favorite_album,
        favorite_song: userData.favorite_song,
        privacy_level:
          userData.privacy_level === 'Everyone'
            ? 'everyone'
            : userData.privacy_level === 'Nobody'
            ? 'nobody'
            : 'friends_only',
      };
      console.log('Upserting profile for user:', userData.user_id);
      const upserted = await userProfileService.upsertUserProfile(
        userData.user_id,
        profileData,
      );

      if (upserted) {
        console.log('Profile upserted!');
      } else {
        console.log('Failed to upsert.');
      }
    } catch (error) {
      console.error('Error upserting profile:', error);
    }
  };

  // Toggle edit mode for a field
  const toggleEdit = field => {
    setIsEditing({
      ...isEditing,
      [field]: !isEditing[field],
    });
  };

  // Select visibility option
  const selectVisibility = option => {
    setUserData({
      ...userData,
      privacy_level: option,
    });
    setVisibilityModalVisible(false);
  };

  // Create moving background circles
  const createLoopingCircles = (animValue, baseStyle, topOffset = 0) => {
    const translateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [topOffset, topOffset + height],
    });

    return (
      <>
        <Animated.View style={[baseStyle, {transform: [{translateY}]}]} />
        <Animated.View
          style={[
            baseStyle,
            {top: -height + topOffset, transform: [{translateY}]},
          ]}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Animated background circles */}
      <View style={styles.backgroundContainer}>
        {createLoopingCircles(circleAnim1, styles.mintCircle, -width * 0.2)}
        {createLoopingCircles(circleAnim2, styles.creamCircle, height * 0.05)}
        {createLoopingCircles(circleAnim3, styles.pinkCircle, height * 0.6)}
      </View>

      {/* Header */}
      <View style={[styles.header, {marginTop: STATUSBAR_HEIGHT}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <TouchableOpacity
          style={styles.saveHeaderButton}
          onPress={handleSaveProfile}>
          <Text style={styles.saveHeaderButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{translateY}],
          },
        ]}>
        {/* Profile Card */}
        <View style={styles.card}>
          {/* Profile Image and Name Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={{uri: userData.profile_image_url}}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.nameContainer}>
              {isEditing.display_name ? (
                <TextInput
                  style={styles.nameInput}
                  value={userData.display_name}
                  onChangeText={text => handleChange('display_name', text)}
                  onBlur={() => toggleEdit('display_name')}
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={() => toggleEdit('display_name')}>
                  <Text style={styles.nameText}>{userData.display_name}</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.followersText}>
                {userData.followers} followers
              </Text>
              <Text style={styles.followersText}>
                {userData.following} following
              </Text>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Bio</Text>
              <TouchableOpacity onPress={() => toggleEdit('bio')}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            {isEditing.bio ? (
              <TextInput
                style={styles.bioInput}
                value={userData.bio}
                onChangeText={text => handleChange('bio', text)}
                onBlur={() => toggleEdit('bio')}
                multiline
                autoFocus
              />
            ) : (
              <Text style={styles.bioText}>{userData.bio}</Text>
            )}
          </View>

          {/* Current Favorites Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Current Favorites</Text>
              <View style={styles.updateIndicator}>
                <View style={styles.updateDot} />
                <Text style={styles.updateText}>New</Text>
              </View>
            </View>

            {/* Music Info */}
            <View style={styles.musicInfo}>
              {/* Artist */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Text style={styles.infoIcon}>🎤</Text>
                  <Text style={styles.infoLabel}>Artist</Text>
                </View>
                {isEditing.favorite_artist ? (
                  <TextInput
                    style={styles.infoInput}
                    value={userData.favorite_artist}
                    onChangeText={text => handleChange('favorite_artist', text)}
                    onBlur={() => toggleEdit('favorite_artist')}
                    autoFocus
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.infoValueContainer}
                    onPress={() => toggleEdit('favorite_artist')}>
                    <Text style={styles.infoValue}>
                      {userData.favorite_artist}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Album */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Text style={styles.infoIcon}>💿</Text>
                  <Text style={styles.infoLabel}>Album</Text>
                </View>
                {isEditing.favorite_album ? (
                  <TextInput
                    style={styles.infoInput}
                    value={userData.favorite_album}
                    onChangeText={text => handleChange('favorite_album', text)}
                    onBlur={() => toggleEdit('favorite_album')}
                    autoFocus
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.infoValueContainer}
                    onPress={() => toggleEdit('favorite_album')}>
                    <Text style={styles.infoValue}>
                      {userData.favorite_album}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Song */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Text style={styles.infoIcon}>🎵</Text>
                  <Text style={styles.infoLabel}>Song</Text>
                </View>
                {isEditing.favorite_song ? (
                  <TextInput
                    style={styles.infoInput}
                    value={userData.favorite_song}
                    onChangeText={text => handleChange('favorite_song', text)}
                    onBlur={() => toggleEdit('favorite_song')}
                    autoFocus
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.infoValueContainer}
                    onPress={() => toggleEdit('favorite_song')}>
                    <Text style={styles.infoValue}>
                      {userData.favorite_song}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Privacy Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Privacy</Text>
            </View>

            {/* Location Visibility */}
            <View style={styles.infoRow}>
              <View style={styles.infoLabelContainer}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoLabel}>Location Visibility</Text>
              </View>
              <TouchableOpacity
                style={styles.visibilitySelector}
                onPress={() => setVisibilityModalVisible(true)}>
                <Text
                  style={[
                    styles.visibilityValue,
                    {
                      color:
                        userData.privacy_level === 'everyone'
                          ? '#4CAF50'
                          : userData.privacy_level === 'friends_only'
                          ? '#FFC107'
                          : '#F44336',
                    },
                  ]}>
                  {userData.privacy_level}
                </Text>
                <View style={styles.dropdownIconContainer}>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Button Row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.spotifyButton}>
              <Text style={styles.spotifyButtonText}>Spotify Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Visibility Modal */}
      <Modal
        visible={visibilityModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisibilityModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisibilityModalVisible(false)}>
          <Animated.View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Who can see your location?</Text>
            {visibilityOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.visibilityOption,
                  userData.privacy_level === option && styles.selectedOption,
                ]}
                onPress={() => selectVisibility(option)}>
                <Text
                  style={[
                    styles.visibilityOptionText,
                    userData.privacy_level === option &&
                      styles.selectedOptionText,
                  ]}>
                  {option}
                </Text>
                {userData.privacy_level === option && (
                  <View style={styles.checkmarkContainer}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  mintCircle: {
    position: 'absolute',
    backgroundColor: '#DCFCE1',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width,
    left: -width * 0.2,
    opacity: 0.8,
    zIndex: -1,
  },
  creamCircle: {
    position: 'absolute',
    backgroundColor: '#FEF9E6',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width,
    right: -width * 0.3,
    opacity: 0.7,
    zIndex: -1,
  },
  pinkCircle: {
    position: 'absolute',
    backgroundColor: '#FADADD',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width,
    right: -width * 0.2,
    opacity: 0.6,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 50,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: PURPLE,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  saveHeaderButton: {
    marginLeft: 10,
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  saveHeaderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(192, 77, 238, 0.3)',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  profileImageWrapper: {
    padding: 3,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: PURPLE,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  nameContainer: {
    marginLeft: 15,
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  nameInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: PURPLE,
    paddingBottom: 2,
  },
  followersText: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: SECTION_BG,
  },
  bioText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  bioInput: {
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
    minHeight: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  updateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 217, 100, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  updateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CD964',
    marginRight: 4,
  },
  updateText: {
    fontSize: 10,
    color: '#4CD964',
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editText: {
    fontSize: 12,
    color: PURPLE,
    fontWeight: '600',
  },
  musicInfo: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    fontWeight: '600',
  },
  infoInput: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: PURPLE,
    paddingBottom: 2,
    minWidth: 100,
  },
  visibilitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visibilityValue: {
    fontSize: 14,
    textAlign: 'right',
    fontWeight: '600',
  },
  dropdownIconContainer: {
    backgroundColor: 'rgba(192, 77, 238, 0.1)',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  dropdownIcon: {
    fontSize: 8,
    color: PURPLE,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  spotifyButton: {
    backgroundColor: '#1DB954',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  spotifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  logoutButtonText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: PURPLE,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  visibilityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedOption: {
    backgroundColor: 'rgba(192, 77, 238, 0.1)',
    borderColor: PURPLE,
    borderWidth: 1,
  },
  visibilityOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: PURPLE,
    fontWeight: '600',
  },
  checkmarkContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Settings;
