import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';

const PURPLE = '#C04DEE';
const DARK_BG = '#141417';
const CARD_BG = '#18191C';

const UserProfileModal = ({visible, onClose, user}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.modalContent}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>{user?.title?.[0] || '?'}</Text>
            </View>
            <Text style={styles.userName}>{user?.title || 'Unknown User'}</Text>
            <Text style={styles.currentSong}>
              Currently listening to: {user?.song || 'Unknown Song'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.addFriendButton}
              onPress={() => {
                // For now, just show an alert
                alert('Friend request sent!');
                onClose();
              }}>
              <Text style={styles.addFriendButtonText}>Add Friend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  profileInitial: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  currentSong: {
    fontSize: 16,
    color: '#9B9B9B',
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: 20,
  },
  addFriendButton: {
    backgroundColor: PURPLE,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addFriendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfileModal; 