import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, LogBox, View} from 'react-native';
import SplashScreen from './src/components/splash';
import SignUp from './src/components/signup';

// Ignore non-critical warnings
LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Function to be called when splash animation completes
  const handleAnimationComplete = () => {
    console.log('App received animation complete signal');
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <SplashScreen onAnimationComplete={handleAnimationComplete} />
      ) : (
        <SignUp />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
