import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 47 : StatusBar.currentHeight || 0;

const ORANGE = '#F3904F';

// Sample message data
const messages = [
  {
    id: '1',
    sender: 'Ayman Khan',
    message: 'Hey, what song are you listening to?',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: '2',
    sender: 'Hedavam Solano',
    message: 'Did you check out that new album?',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '3',
    sender: 'Mike',
    message: "Let's meet up at the concert tonight!",
    time: 'Wed',
    unread: false,
  },
  {
    id: '4',
    sender: 'Sarah',
    message: 'I shared a playlist with you',
    time: 'Tue',
    unread: true,
  },
  {
    id: '5',
    sender: 'David',
    message: 'Thanks for the song recommendation',
    time: 'Mon',
    unread: false,
  },
];

const MessagesScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={[styles.header, {marginTop: STATUSBAR_HEIGHT}]}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.messageItem}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.sender.charAt(0)}</Text>
              </View>
              {item.unread && <View style={styles.unreadIndicator} />}
            </View>
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.senderName}>{item.sender}</Text>
                <Text style={styles.messageTime}>{item.time}</Text>
              </View>
              <Text style={styles.messageText} numberOfLines={1}>
                {item.message}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.messagesList}
      />

      {/* New Message Button */}
      <TouchableOpacity style={styles.newMessageButton}>
        <FontAwesome name="pencil" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFE7',
  },
  header: {
    padding: 16,
    backgroundColor: '#F2EFE7',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  messagesList: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  unreadIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#FFF',
    right: 0,
    top: 0,
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
  newMessageButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default MessagesScreen;
