import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {MaterialIcons, FontAwesome, Ionicons} from '@expo/vector-icons';

// Simplified SongIdentifier without requiring external images
const SongIdentifier = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.albumArtPlaceholder}>
          <Text style={styles.albumArtPlaceholderText}>🎵</Text>
        </View>

        <View style={styles.songInfoContainer}>
          <Text style={styles.songName} numberOfLines={1}>
            Song Name
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            Artist
          </Text>
          <Text style={styles.albumName} numberOfLines={1}>
            Album
          </Text>
        </View>

        <TouchableOpacity style={styles.playButton}>
          <View style={styles.playIcon}>
            <Text style={styles.playIconText}>▶</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120, // Position it above the search bar
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  albumArtPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  albumArtPlaceholderText: {
    fontSize: 24,
  },
  songInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  songName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  artistName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  albumName: {
    fontSize: 14,
    color: '#888',
  },
  playButton: {
    marginLeft: 10,
  },
  playIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1DB954', // Spotify green
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    color: 'white',
    fontSize: 20,
  },
});

export default SongIdentifier;
