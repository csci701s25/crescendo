/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './frontend/src/screens/LoginScreen';
import SplashScreen from './frontend/src/components/intro/SplashScreen';
import MapScreen from './frontend/src/components/mapView/MapView';
import MapGlobal from './frontend/src/components/mapView/MapGlobal';
import Settings from './frontend/src/components/mapView/Settings';

import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

// View toggle button components
const ViewToggleButtons = ({isGlobal, onToggle}) => {
  const PURPLE = '#C04DEE';
  const SUNSET_ORANGE = '#F3904F';

  return (
    <View style={styles.viewToggleButtons}>
      {/* Local View Button */}
      <TouchableOpacity
        style={[
          styles.viewToggleButton,
          !isGlobal ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => (!isGlobal ? null : onToggle(false))}>
        <Ionicons
          name="location"
          size={24}
          color={!isGlobal ? '#fff' : SUNSET_ORANGE}
        />
      </TouchableOpacity>

      {/* Global View Button */}
      <TouchableOpacity
        style={[
          styles.viewToggleButton,
          isGlobal ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => (isGlobal ? null : onToggle(true))}>
        <Ionicons
          name="globe-outline"
          size={24}
          color={isGlobal ? '#fff' : SUNSET_ORANGE}
        />
      </TouchableOpacity>
    </View>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGlobalView, setIsGlobalView] = useState(true);

  // Function to be called when splash animation completes
  const handleAnimationComplete = () => {
    console.log('App received animation complete signal');
    setIsLoading(false);
  };

  // Custom map screen that can toggle between local and global view
  const MapScreenWithToggle = ({navigation, route}) => {
    const toggleMapView = showGlobal => {
      setIsGlobalView(showGlobal);
    };

    return (
      <View style={styles.container}>
        {isGlobalView ? (
          <MapGlobal navigation={navigation} />
        ) : (
          <MapScreen navigation={navigation} />
        )}
        <ViewToggleButtons isGlobal={isGlobalView} onToggle={toggleMapView} />
      </View>
    );
  };

  return (
    <NavigationContainer>
      {isLoading ? (
        <View style={styles.container}>
          <SplashScreen onAnimationComplete={handleAnimationComplete} />
        </View>
      ) : (
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="MapScreen" component={MapScreenWithToggle} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewToggleButtons: {
    position: 'absolute',
    top: '50%', // Center vertically
    right: 16,
    marginTop: -60, // Adjust based on button heights
    zIndex: 1000,
    alignItems: 'center',
  },
  viewToggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  activeButton: {
    backgroundColor: '#F3904F',
    borderColor: '#F3904F',
  },
  inactiveButton: {
    backgroundColor: 'white',
    borderColor: '#F3904F',
  },
});

export default App;
