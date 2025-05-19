import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationPanel = ({isVisible, onClose}) => {
  const [notifications, setNotifications] = useState([]);
  const notificationAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(notificationAnimation, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible, notificationAnimation]);

  // Example notifications - replace with actual API call
  useEffect(() => {
    const fetchNotifications = async () => {
      // This will be replaced with actual API call
      const exampleNotifications = [
        {
          id: '1',
          follower_id: 'user1',
          follower_name: 'John',
          follower_image: 'https://i.pravatar.cc/150?img=8',
          request_type: 'close_friend',
          request_status: 'pending',
          is_close_friend: false,
          created_at: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          updated_at: new Date(Date.now() - 1000 * 60 * 5),
        },
        {
          id: '2',
          follower_id: 'user2',
          follower_name: 'An A.',
          follower_image: 'https://i.pravatar.cc/150?img=3',
          request_type: 'close_friend',
          request_status: 'pending',
          is_close_friend: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          updated_at: new Date(Date.now() - 1000 * 60 * 30),
        },
      ];
      setNotifications(exampleNotifications);
    };

    if (isVisible) {
      fetchNotifications();
    }
  }, [isVisible]);

  const handleRequest = async (requestId, action) => {
    // This will be replaced with actual API call
    console.log(`Handling request ${requestId} with action ${action}`);
    // Example API call structure:
    // await fetch('/api/connections', {
    //   method: 'PUT',
    //   body: JSON.stringify({
    //     id: requestId,
    //     request_status: action, // 'accepted' or 'rejected'
    //   }),
    // });

    // Update local state
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === requestId
          ? {...notification, request_status: action}
          : notification,
      ),
    );
  };

  const formatTimeAgo = date => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: notificationAnimation,
          transform: [
            {
              translateY: notificationAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            },
          ],
        },
      ]}>
      <ScrollView style={styles.notificationList}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>Notifications</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No pending requests</Text>
          </View>
        ) : (
          notifications.map(notification => (
            <View key={notification.id} style={styles.notificationItem}>
              <Image
                source={{uri: notification.follower_image}}
                style={styles.profileImage}
              />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationText}>
                  <Text style={styles.notificationBold}>
                    {notification.follower_name}
                  </Text>
                  {' sent you a friend request'}
                </Text>
                <Text style={styles.notificationTime}>
                  {formatTimeAgo(notification.created_at)}
                </Text>
              </View>
              {notification.request_status === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleRequest(notification.id, 'accepted')}>
                    <Icon name="check" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleRequest(notification.id, 'rejected')}>
                    <Icon name="close" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              {notification.request_status === 'accepted' && (
                <View style={styles.statusIndicator}>
                  <Icon name="check-circle" size={18} color="#4CAF50" />
                </View>
              )}
              {notification.request_status === 'rejected' && (
                <View style={styles.statusIndicator}>
                  <Icon name="cancel" size={18} color="#F44336" />
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: 320,
    maxHeight: 400,
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
  notificationList: {
    maxHeight: 400,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  notificationBold: {
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  statusIndicator: {
    padding: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
  },
});

export default NotificationPanel;
