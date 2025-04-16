import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import SplashScreen from './src/components/splash';
import SignUp from './src/components/signup';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Function to be called when splash animation completes
  const handleAnimationComplete = () => {
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <SplashScreen onAnimationComplete={handleAnimationComplete} />
      ) : (
        <SignUp />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
