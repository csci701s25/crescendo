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

import {StyleSheet, View} from 'react-native';

const Stack = createNativeStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  // Function to be called when splash animation completes
  const handleAnimationComplete = () => {
    console.log('App received animation complete signal');
    setIsLoading(false);
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
          <Stack.Screen name="MapScreen" component={MapScreen} />
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
});
export default App;
