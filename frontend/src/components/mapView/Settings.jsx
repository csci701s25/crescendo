//src/components/Settings.js
import React, {useState, useRef} from 'react';
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
} from 'react-native';

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0;
const PURPLE = '#C04DEE';
const DARK_BG = '#141417';
const CARD_BG = '#18191C';

const Settings = ({navigation}) => {
  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  // User data state
  const [userData, setUserData] = useState({
    name: 'Ayman Khan',
    bio: 'Music enthusiast from Bronx. I love discovering new artists.',
    followers: '1,452',
    artist: 'Frank Ocean',
    album: 'Blonde',
    song: 'Nights',
    locationVisibility: 'Friends only',
  });

  // Editing states
  const [isEditing, setIsEditing] = useState({
    name: false,
    bio: false,
    artist: false,
    album: false,
    song: false,
  });

  // Modal visibility state
  const [visibilityModalVisible, setVisibilityModalVisible] = useState(false);

  // Visibility options
  const visibilityOptions = ['Everyone', 'Friends only', 'Nobody'];

  // Animation on component mount
  React.useEffect(() => {
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
  }, [fadeAnim, translateY]);

  // Handle text input changes
  const handleChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value,
    });
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
      locationVisibility: option,
    });
    setVisibilityModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Gradient Top Element */}
      <View style={styles.gradientTop} />

      {/* Header */}
      <View style={[styles.header, {marginTop: STATUSBAR_HEIGHT}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
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
            <Image
              source={require('../../../assets/images/1.jpg')}
              style={styles.profileImage}
            />

            <View style={styles.nameContainer}>
              {isEditing.name ? (
                <TextInput
                  style={styles.nameInput}
                  value={userData.name}
                  onChangeText={text => handleChange('name', text)}
                  onBlur={() => toggleEdit('name')}
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={() => toggleEdit('name')}>
                  <Text style={styles.nameText}>{userData.name}</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.followersText}>
                {userData.followers} followers
              </Text>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
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
          <View style={styles.favoritesSection}>
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
                {isEditing.artist ? (
                  <TextInput
                    style={styles.infoInput}
                    value={userData.artist}
                    onChangeText={text => handleChange('artist', text)}
                    onBlur={() => toggleEdit('artist')}
                    autoFocus
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.infoValueContainer}
                    onPress={() => toggleEdit('artist')}>
                    <Text style={styles.infoValue}>{userData.artist}</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Album */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Text style={styles.infoIcon}>💿</Text>
                  <Text style={styles.infoLabel}>Album</Text>
                </View>
                {isEditing.album ? (
                  <TextInput
                    style={styles.infoInput}
                    value={userData.album}
                    onChangeText={text => handleChange('album', text)}
                    onBlur={() => toggleEdit('album')}
                    autoFocus
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.infoValueContainer}
                    onPress={() => toggleEdit('album')}>
                    <Text style={styles.infoValue}>{userData.album}</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Song */}
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Text style={styles.infoIcon}>🎵</Text>
                  <Text style={styles.infoLabel}>Song</Text>
                </View>
                {isEditing.song ? (
                  <TextInput
                    style={styles.infoInput}
                    value={userData.song}
                    onChangeText={text => handleChange('song', text)}
                    onBlur={() => toggleEdit('song')}
                    autoFocus
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.infoValueContainer}
                    onPress={() => toggleEdit('song')}>
                    <Text style={styles.infoValue}>{userData.song}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Privacy Section */}
          <View style={styles.privacySection}>
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
                    styles.infoValue,
                    {
                      color:
                        userData.locationVisibility === 'Everyone'
                          ? '#4CAF50'
                          : userData.locationVisibility === 'Friends only'
                          ? '#FFC107'
                          : '#F44336',
                    },
                  ]}>
                  {userData.locationVisibility}
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
                  userData.locationVisibility === option &&
                    styles.selectedOption,
                ]}
                onPress={() => selectVisibility(option)}>
                <Text
                  style={[
                    styles.visibilityOptionText,
                    userData.locationVisibility === option &&
                      styles.selectedOptionText,
                  ]}>
                  {option}
                </Text>
                {userData.locationVisibility === option && (
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
    backgroundColor: DARK_BG,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: PURPLE,
    opacity: 0.3,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
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
    shadowColor: PURPLE,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    padding: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: PURPLE,
  },
  nameContainer: {
    marginLeft: 15,
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: PURPLE,
    paddingBottom: 2,
  },
  followersText: {
    fontSize: 14,
    color: '#9B9B9B',
    marginTop: 3,
  },
  bioSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  bioText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  bioInput: {
    fontSize: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  favoritesSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
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
    color: '#9B9B9B',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  editText: {
    fontSize: 12,
    color: PURPLE,
    fontWeight: '500',
  },
  musicInfo: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  infoValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'right',
  },
  infoInput: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: PURPLE,
    paddingBottom: 2,
    minWidth: 100,
  },
  privacySection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  visibilitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    padding: 15,
  },
  spotifyButton: {
    backgroundColor: '#1DB954',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  spotifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    flex: 1,
  },
  logoutButtonText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: PURPLE,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedOption: {
    backgroundColor: 'rgba(192, 77, 238, 0.2)',
    borderColor: PURPLE,
    borderWidth: 1,
  },
  visibilityOptionText: {
    fontSize: 16,
    color: '#fff',
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
