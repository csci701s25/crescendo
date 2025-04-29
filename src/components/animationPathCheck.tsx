import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AnimationPathCheck = () => {
  useEffect(() => {
    // Test loading the animation file directly
    try {
      const animationFile = require('../../assets/animations/Main.json');
      console.log('Animation file loaded successfully:', typeof animationFile);

      // Check if the file contains expected properties for Lottie
      console.log(
        'Animation properties:',
        'v' in animationFile ? 'Has version' : 'No version',
        'layers' in animationFile
          ? `Has ${animationFile.layers.length} layers`
          : 'No layers',
        'assets' in animationFile
          ? `Has ${animationFile.assets.length} assets`
          : 'No assets',
        'nm' in animationFile ? `Named: ${animationFile.nm}` : 'No name',
      );
    } catch (error) {
      console.error('Failed to load animation file:', error);
    }

    // Also try alternative paths in case of misconfiguration
    try {
      const altPath = require('../../assets/Main.json');
      console.log('Found animation at alternate path (assets/Main.json)');
    } catch (error) {
      console.log('Not found at assets/Main.json');
    }

    try {
      const altPath2 = require('../assets/animations/Main.json');
      console.log(
        'Found animation at alternate path (../assets/animations/Main.json)',
      );
    } catch (error) {
      console.log('Not found at ../assets/animations/Main.json');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Checking animation file path...</Text>
      <Text style={styles.text}>See console for results</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
});

export default AnimationPathCheck;
