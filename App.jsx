/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from './frontend/src/screens/LoginScreen';
import SplashScreen from './frontend/src/components/intro/SplashScreen';
import MapScreen from './frontend/src/components/mapView/MapView';
import MapGlobal from './frontend/src/components/mapView/MapGlobal';
import Settings from './frontend/src/components/mapView/Settings';
import MessagesScreen from './frontend/src/components/messages/MessagesScreen';


import {StyleSheet, View, Text} from 'react-native';
import {Ionicons, FontAwesome} from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Colors
const ORANGE = '#F3904F';
const PURPLE = '#C04DEE';

// Tab Navigator Component
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ORANGE,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EFEFEF',
          height: 85,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="People"
        component={MapGlobal}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={MapScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={MapGlobal}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="chatbubble" size={size} color={color} />
          ),
          tabBarBadge: 2, // Example badge for unread messages
          tabBarBadgeStyle: {backgroundColor: PURPLE},
        }}
      />
      <Tab.Screen
        name="Me"
        component={Settings}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// A simple dummy component we can use if needed
function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Function to be called when splash animation completes
  const handleAnimationComplete = () => {
    console.log('App received animation complete signal');
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SplashScreen onAnimationComplete={handleAnimationComplete} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{gestureEnabled: false}}
        />
      </Stack.Navigator>
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
