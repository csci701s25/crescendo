import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import VideoAnimation from './VideoAnimation';
import {useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    console.log('SplashScreen mounted');

    // This is a backup timeout in case animation fails to trigger onAnimationComplete
    const backupTimeout = setTimeout(() => {
      console.log('SplashScreen backup timeout triggered');
      navigation.replace('Onboarding');
    }, 6000); // 6 second backup

    return () => clearTimeout(backupTimeout);
  }, [navigation]);

  const handleAnimationComplete = () => {
    console.log('Animation completed, moving to onboarding');
    navigation.replace('Onboarding');
  };

  return (
    <View style={styles.container}>
      <VideoAnimation onAnimationComplete={handleAnimationComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});

export default SplashScreen;
