/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './frontend/src/screens/LoginScreen';
import SplashScreen from './frontend/src/components/intro/SplashScreen';

import {StyleSheet, View} from 'react-native';

function App(): React.JSX.Element {
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
        <LoginScreen />
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
