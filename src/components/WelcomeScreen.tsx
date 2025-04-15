// src/screens/WelcomeScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// Import your SVG logo
import Logo from '../assets/logo.svg';

type RootStackParamList = {
  Map: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const opacity = useState(new Animated.Value(0))[0];
  const scale = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    // Start fade in animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to map screen after delay
    const timer = setTimeout(() => {
      navigation.navigate('Map');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, opacity, scale]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity,
            transform: [{scale}],
          },
        ]}>
        <Logo width={200} height={200} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F1',
  },
  logoContainer: {
    alignItems: 'center',
  },
});

export default WelcomeScreen;
