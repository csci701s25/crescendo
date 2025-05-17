import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import {BlurView} from 'expo-blur';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;

// Echo Sessions data
const echoSessions = [
  {
    id: '1',
    title: 'Echo Session',
    subtitle: 'Join 23 others listening to hip-hop',
    listeners: 23,
    avatars: [
      'https://randomuser.me/api/portraits/women/33.jpg',
      'https://randomuser.me/api/portraits/men/54.jpg',
      'https://randomuser.me/api/portraits/women/67.jpg',
    ],
  },
  {
    id: '2',
    title: 'Chill Vibes',
    subtitle: 'Join 15 others listening to indie',
    listeners: 15,
    avatars: [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/22.jpg',
    ],
  },
  {
    id: '3',
    title: 'Start Your Session',
    subtitle: 'Create your own listening party',
    listeners: 0,
    isCreate: true,
  },
];

// Dummy data for college playlist
const playlistSongs = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'M83',
    cover: 'https://i.imgur.com/8Km9tLL.jpg',
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    cover: 'https://i.imgur.com/1bX5QH6.jpg',
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    cover: 'https://i.imgur.com/2nCt3Sbl.jpg',
  },
];

// Friendly faces data
const friendlyFaces = [
  {
    id: '1',
    name: 'You & Emma',
    subtitle: 'Share the same favorite song 👀',
    avatars: [
      'https://randomuser.me/api/portraits/men/1.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
    ],
  },
];

const EchoSessionCard = ({session}) => {
  if (session.isCreate) {
    return (
      <BlurView
        intensity={30}
        tint="light"
        style={[styles.echoCard, styles.echoCardBorder]}>
        <View style={styles.liveCardHeader}>
          <Text style={styles.liveTitle}>Start Your Session</Text>
          <Text style={styles.liveSubtitle}>
            Create your own listening party
          </Text>
        </View>
        <View style={styles.liveCardContent}>
          <TouchableOpacity style={[styles.joinButton, styles.createButton]}>
            <Text style={styles.joinButtonText}>Create Session</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    );
  }

  return (
    <BlurView
      intensity={30}
      tint="light"
      style={[styles.echoCard, styles.echoCardBorder]}>
      <View style={styles.liveCardHeader}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE NOW</Text>
        </View>
        <Text style={styles.liveTitle}>{session.title}</Text>
        <Text style={styles.liveSubtitle}>{session.subtitle}</Text>
      </View>

      <View style={styles.liveCardContent}>
        <View style={styles.liveAvatarRow}>
          {session.avatars.map((avatar, index) => (
            <Image
              key={index}
              source={{uri: avatar}}
              style={[styles.liveAvatar, index > 0 && {marginLeft: -15}]}
            />
          ))}
          <View style={styles.moreAvatars}>
            <Text style={styles.moreAvatarsText}>+{session.listeners - 3}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join Session</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

const Discover = () => {
  const [echoIndex, setEchoIndex] = useState(0);
  const echoListRef = useRef(null);

  const handleEchoScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + 16));
    setEchoIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.discoverTitle}>Discover</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {/* Echo Sessions */}
        <View style={styles.echoSessionsContainer}>
          <FlatList
            ref={echoListRef}
            data={echoSessions}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.echoSessionsList}
            renderItem={({item}) => (
              <View style={styles.echoCardWrapper}>
                <EchoSessionCard session={item} />
              </View>
            )}
            keyExtractor={item => item.id}
            onScroll={handleEchoScroll}
            scrollEventThrottle={16}
          />
          <View style={styles.echoIndicatorWrapper}>
            {echoSessions.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.echoDot,
                  echoIndex === idx
                    ? styles.echoDotActive
                    : styles.echoDotInactive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Hits from the Week */}
        <View style={styles.cardWrapper}>
          <BlurView intensity={20} tint="light" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Hits from the Week</Text>
              <View style={styles.cardTitleDot} />
              <Text style={styles.cardSubtitle}>3 new songs</Text>
            </View>

            {playlistSongs.map((song, index) => (
              <View
                key={song.id}
                style={[
                  styles.songRow,
                  index === playlistSongs.length - 1 && styles.lastSongRow,
                ]}>
                <Image source={{uri: song.cover}} style={styles.songCover} />
                <View style={styles.songInfo}>
                  <Text style={styles.songName}>{song.title}</Text>
                  <Text style={styles.songArtist}>{song.artist}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.seeMoreButton}>
              <Text style={styles.seeMoreText}>See all songs</Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Friendly Faces Card */}
        <View style={styles.cardWrapper}>
          <BlurView intensity={20} tint="light" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Friendly Faces</Text>
              <View style={styles.cardTitleDot} />
              <Text style={styles.cardSubtitle}>People with similar taste</Text>
            </View>

            {friendlyFaces.map((face, index) => (
              <View
                key={face.id}
                style={[
                  styles.faceRow,
                  index === friendlyFaces.length - 1 && styles.lastFaceRow,
                ]}>
                <View style={styles.avatarGroup}>
                  {face.avatars.map((avatar, idx) => (
                    <Image
                      key={idx}
                      source={{uri: avatar}}
                      style={[
                        styles.avatarLarge,
                        styles.avatarOverlap,
                        {marginLeft: idx > 0 ? -15 : 0},
                        {zIndex: face.avatars.length - idx},
                      ]}
                    />
                  ))}
                </View>

                <View style={styles.faceInfo}>
                  <Text style={styles.faceName}>{face.name}</Text>
                  <Text style={styles.faceSubtitle}>{face.subtitle}</Text>
                </View>

                <TouchableOpacity style={styles.connectButton}>
                  <Text style={styles.connectButtonText}>Connect</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.seeMoreButton}>
              <Text style={styles.seeMoreText}>Find more friends</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFE7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  discoverTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  echoSessionsContainer: {
    marginBottom: 24,
  },
  echoSessionsList: {
    paddingHorizontal: 20,
  },
  echoCardWrapper: {
    marginRight: 16,
    width: CARD_WIDTH,
  },
  echoCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    minHeight: 170,
  },
  echoCardBorder: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    shadowColor: '#FF4B4B',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardWrapper: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'visible',
  },
  card: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: '700',
  },
  cardTitleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    marginHorizontal: 8,
  },
  cardSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  lastSongRow: {
    borderBottomWidth: 0,
  },
  songCover: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songName: {
    color: '#333',
    fontWeight: '500',
    fontSize: 15,
  },
  songArtist: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  seeMoreButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  seeMoreText: {
    color: '#C04DEE',
    fontWeight: '600',
    fontSize: 14,
  },
  faceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  lastFaceRow: {
    borderBottomWidth: 0,
  },
  avatarGroup: {
    flexDirection: 'row',
    width: 60,
  },
  avatarLarge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarOverlap: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  faceInfo: {
    flex: 1,
    marginLeft: 10,
  },
  faceName: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
  faceSubtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  connectButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(192, 77, 238, 0.1)',
  },
  connectButtonText: {
    color: '#C04DEE',
    fontWeight: '600',
    fontSize: 12,
  },
  liveCard: {
    backgroundColor: '#fff',
    padding: 0,
    overflow: 'hidden',
  },
  liveCardHeader: {
    padding: 20,
    paddingBottom: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B4B',
    marginRight: 1,
  },
  liveText: {
    color: '#FF4B4B',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  liveTitle: {
    color: '#333',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  liveSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  liveCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 75, 75, 0.05)',
    padding: 16,
  },
  liveAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreAvatars: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -15,
  },
  moreAvatarsText: {
    color: '#333',
    fontSize: 10,
    fontWeight: '600',
  },
  joinButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FF4B4B',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  createButton: {
    marginTop: 15,
    backgroundColor: '#C04DEE',
  },
  echoIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  echoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    borderWidth: 1.5,
  },
  echoDotActive: {
    backgroundColor: '#C04DEE',
    borderColor: '#C04DEE',
  },
  echoDotInactive: {
    backgroundColor: 'transparent',
    borderColor: '#C04DEE',
  },
});

export default Discover;
