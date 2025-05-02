import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Marker} from 'react-native-maps';
import {Ionicons} from '@expo/vector-icons';

const UserMarkers = ({onUserDataLoaded}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // When you have a backend setup, replace this with actual API call
    fetchMockUsers();
  }, []);

  // Mock function to simulate backend API call
  const fetchMockUsers = () => {
    // Simulate network delay
    setTimeout(() => {
      try {
        // Mock data
        const mockUsers = [
          {
            id: '1',
            name: 'John',
            currentSong: {
              title: 'Blinding Lights',
              artist: 'The Weeknd',
            },
            location: {
              latitude: 37.78925,
              longitude: -122.4344,
            },
          },
          {
            id: '2',
            name: 'Emma',
            currentSong: {
              title: 'As It Was',
              artist: 'Harry Styles',
            },
            location: {
              latitude: 37.78625,
              longitude: -122.4304,
            },
          },
          {
            id: '3',
            name: 'Mike',
            currentSong: {
              title: 'Cruel Summer',
              artist: 'Taylor Swift',
            },
            location: {
              latitude: 37.78725,
              longitude: -122.4364,
            },
          },
          {
            id: '4',
            name: 'Sarah',
            currentSong: {
              title: 'Kill Bill',
              artist: 'SZA',
            },
            location: {
              latitude: 37.79025,
              longitude: -122.4354,
            },
          },
          {
            id: '5',
            name: 'David',
            currentSong: {
              title: 'Flowers',
              artist: 'Miley Cyrus',
            },
            location: {
              latitude: 37.78525,
              longitude: -122.4274,
            },
          },
        ];

        setUsers(mockUsers);

        // If callback prop exists, pass the data back to parent
        if (onUserDataLoaded) {
          onUserDataLoaded(mockUsers);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching mock users:', err);
      } finally {
        setLoading(false);
      }
    }, 1000); // Simulate 1 second loading time
  };

  // For real backend integration, use this function instead of fetchMockUsers
  /*
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('YOUR_API_URL/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
      
      if (onUserDataLoaded) {
        onUserDataLoaded(data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  */

  // If still loading or error occurred, don't render markers yet
  if (loading || error) return null;

  return (
    <>
      {users.map(user => (
        <Marker
          key={user.id}
          coordinate={user.location}
          title={user.name}
          description={`Listening to ${user.currentSong.title} by ${user.currentSong.artist}`}>
          <View style={styles.markerContainer}>
            <View style={styles.marker}>
              <Text style={styles.markerText}>🎵</Text>
              {/* Alternative: Use icon if emoji doesn't render well
              <Ionicons name="musical-note" size={20} color="white" /> */}
            </View>
          </View>
        </Marker>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C04DEE',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    fontSize: 20,
    color: 'white',
  },
});

export default UserMarkers;
