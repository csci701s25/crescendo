import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const PURPLE = '#C04DEE';

const MusicIcon = ({color = '#888', size = 18}) => (
  <Ionicons name="musical-note" size={size} color={color} />
);

const GlobalInfoCard = ({
  cardHeight,
  cardAnimation,
  isCardExpanded,
  toggleCard,
}) => {
  // Sample data for currently playing song
  const [currentSong, setCurrentSong] = useState({
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    coverImage: require('../../../assets/images/1.jpg'), // Replace with proper path
    listeners: 153,
  });

  // Sample top songs in the area
  const topSongs = [
    {id: 1, name: 'As It Was', artist: 'Harry Styles', listeners: 153},
    {id: 2, name: 'Blinding Lights', artist: 'The Weeknd', listeners: 122},
    {id: 3, name: 'Bad Habit', artist: 'Steve Lacy', listeners: 98},
  ];

  return (
    <Animated.View style={[styles.infoCard, {height: cardHeight}]}>
      {/* Card Header with Currently Playing */}
      <TouchableOpacity style={styles.cardHeader} onPress={toggleCard}>
        <View style={styles.headerContent}>
          <Image source={currentSong.coverImage} style={styles.albumCover} />
          <View style={styles.songInfo}>
            <Text style={styles.currentlyPlayingText}>CURRENTLY TRENDING</Text>
            <Text style={styles.songTitleText}>{currentSong.title}</Text>
            <Text style={styles.artistText}>{currentSong.artist}</Text>
          </View>
        </View>
        <View style={styles.listenerCount}>
          <Text style={styles.listenerCountText}>{currentSong.listeners}</Text>
          <MusicIcon color={PURPLE} size={14} />
        </View>
      </TouchableOpacity>

      {/* Expanded content with top songs */}
      <Animated.View
        style={[styles.cardExpandedContent, {opacity: cardAnimation}]}>
        <Text style={styles.sectionTitle}>Top Songs in This Area</Text>

        {topSongs.map(song => (
          <View key={song.id} style={styles.songItem}>
            <Text style={styles.songRank}>{song.id}</Text>
            <View style={styles.songDetails}>
              <Text style={styles.songName}>{song.name}</Text>
              <Text style={styles.artistName}>{song.artist}</Text>
            </View>
            <View style={styles.miniListenerCount}>
              <Text style={styles.miniListenerText}>{song.listeners}</Text>
              <MusicIcon color="#888" size={12} />
            </View>
          </View>
        ))}

        {/* Song Recommendations Section */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Music You Might Like</Text>
          <Text style={styles.recommendationText}>
            Based on popular music in this area, you might enjoy tracks from
            Glass Animals, Doja Cat, and The Kid LAROI.
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  currentlyPlayingText: {
    fontSize: 10,
    fontWeight: '600',
    color: PURPLE,
    letterSpacing: 0.5,
  },
  songTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  artistText: {
    fontSize: 14,
    color: '#666',
  },
  listenerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  listenerCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PURPLE,
    marginRight: 4,
  },
  cardExpandedContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 12,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  songRank: {
    width: 24,
    fontSize: 14,
    fontWeight: 'bold',
    color: PURPLE,
  },
  songDetails: {
    flex: 1,
  },
  songName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  artistName: {
    fontSize: 12,
    color: '#888',
  },
  miniListenerCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniListenerText: {
    fontSize: 12,
    color: '#888',
    marginRight: 4,
  },
  recommendationsSection: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f0ff',
    borderRadius: 12,
  },
  recommendationText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
});

export default GlobalInfoCard;
