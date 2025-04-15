// src/components/MapView.tsx
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Alert, ActivityIndicator} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {PermissionsAndroid, Platform} from 'react-native';

// Directly use the token to fix the 401 error
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYW4xMDY1IiwiYSI6ImNtN25nbGIxNDAwemwyam9ob3NtdzdtcDkifQ.vCNExqx1YKqsExEOsUSYSw',
);

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        getUserLocation();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Crescendo needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserLocation();
        } else {
          setLoading(false);
          Alert.alert('Permission Denied', 'Location permission is required');
        }
      }
    } catch (err) {
      console.warn(err);
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const {longitude, latitude} = position.coords;
        setUserLocation([longitude, latitude]);
        setLoading(false);
      },
      error => {
        console.log(error);
        setLoading(false);
        Alert.alert('Error', 'Unable to retrieve your location');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Dark}
        logoEnabled={false}
        attributionPosition={{top: 8, left: 8}}
        compassEnabled={true}
        compassViewMargins={{x: 16, y: 140}}>
        <MapboxGL.Camera
          zoomLevel={15}
          centerCoordinate={userLocation || [-122.4324, 37.7795]}
          animationMode="flyTo"
          animationDuration={1000}
        />

        {userLocation && (
          <MapboxGL.PointAnnotation id="userLocation" coordinate={userLocation}>
            {/* Single view for user location marker */}
            <View style={styles.userLocationMarker} />
          </MapboxGL.PointAnnotation>
        )}

        <MapboxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
        />
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1DB954',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
});

export default MapView;
