// frontend/src/components/mapView/SearchBar.jsx
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NotificationPanel from './NotificationPanel';

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  isDropdownVisible,
  setIsDropdownVisible,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;

  // Sync local state with parent state
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle dropdown animation
  useEffect(() => {
    Animated.timing(dropdownAnimation, {
      toValue: isDropdownVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isDropdownVisible, dropdownAnimation]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, setSearchQuery]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    if (isNotificationVisible) {
      setIsNotificationVisible(false);
    }
  };

  const toggleNotifications = () => {
    setIsNotificationVisible(!isNotificationVisible);
    if (isDropdownVisible) {
      setIsDropdownVisible(false);
    }
  };

  const selectSearchType = type => {
    setSearchType(type);
    setIsDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchTypeContainer}>
          <TouchableOpacity onPress={toggleDropdown} style={styles.typeButton}>
            <Text style={styles.typeText}>{searchType}</Text>
            <Icon
              name={
                isDropdownVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder={`Search ${searchType.toLowerCase()}...`}
          value={localSearchQuery}
          onChangeText={setLocalSearchQuery}
          returnKeyType="search"
        />
        <TouchableOpacity
          onPress={toggleNotifications}
          style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {isDropdownVisible && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: dropdownAnimation,
              transform: [
                {
                  translateY: dropdownAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => selectSearchType('Songs')}>
            <View style={styles.dropdownItemContent}>
              <Text
                style={[
                  styles.dropdownText,
                  searchType === 'Songs' && styles.selectedText,
                ]}>
                Songs
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => selectSearchType('Artists')}>
            <View style={styles.dropdownItemContent}>
              <Text
                style={[
                  styles.dropdownText,
                  searchType === 'Artists' && styles.selectedText,
                ]}>
                Artists
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => selectSearchType('People')}>
            <View style={styles.dropdownItemContent}>
              <Text
                style={[
                  styles.dropdownText,
                  searchType === 'People' && styles.selectedText,
                ]}>
                People
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      <NotificationPanel
        isVisible={isNotificationVisible}
        onClose={() => setIsNotificationVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    left: '5%',
    width: '90%',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 12,
    fontSize: 16,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default SearchBar;
