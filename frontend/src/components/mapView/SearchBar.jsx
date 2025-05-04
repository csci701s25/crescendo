// frontend/src/components/mapView/SearchBar.jsx
import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
} from 'react-native';
import {FontAwesome, Ionicons, MaterialIcons} from '@expo/vector-icons';

const UserIcon = ({color = '#F3904F', size = 18}) => (
  <FontAwesome name="user" size={size} color={color} />
);
const MusicIcon = ({color = '#F3904F', size = 18}) => (
  <Ionicons name="musical-note" size={size} color={color} />
);
const SearchIcon = ({color = '#F3904F', size = 18}) => (
  <Ionicons name="search" size={size} color={color} />
);

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  isDropdownVisible,
  setIsDropdownVisible,
  dropdownAnimation,
}) => {
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

  return (
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
              <UserIcon color="'#F3904F'" size={20} />
            ) : (
              <MusicIcon color="#F3904F" size={20} />
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
              color={searchType === 'artists' ? '#F3904F' : '#888'}
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
              color={searchType === 'songs' ? '#F3904F' : '#888'}
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
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 10,
    marginBottom: 10,
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
    color: '#F3904F',
    fontWeight: '500',
  },
});

export default SearchBar;
