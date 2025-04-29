// App.tsx (updated with Settings)
import React, {useState} from 'react';
import {StyleSheet, LogBox, View} from 'react-native';
import SplashScreen from './src/components/splash';
import SignUp from './src/components/signup';
import MapView from './src/components/MapView';
import Settings from './src/components/Settings';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Ignore non-critical warnings
LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

const Stack = createNativeStackNavigator();

const App = () => {
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
          initialRouteName="SignUp"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="MapView" component={MapView} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
