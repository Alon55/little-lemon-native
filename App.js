import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Splash from './screens/Splash';
import logo from './assets/logo.png'

export default function App() {
  const Stack = createNativeStackNavigator();
  const [signedStatus, setSignedStatusd] = useState({ isLoading: true, isOnboardingCompleted: false })



  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('isOnboardingCompleted');
        setSignedStatusd({ isLoading: false, isOnboardingCompleted: JSON.parse(value) })
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  const handleSignedStatusd = (boolean) => {
    setSignedStatusd({ ...signedStatus, isOnboardingCompleted: boolean })
  }

  if (signedStatus.isLoading) {
    return <View style={styles.container}><Splash /></View>;
  }

  if (!signedStatus.isOnboardingCompleted) {
    return <View style={styles.container}><Onboarding handleSignedStatusd={handleSignedStatusd} /></View>;
  }
  return (
    <View style={styles.container} >
      <NavigationContainer>
        <View style={styles.innerContainer}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} initialParams={{ handleSignedStatusd }} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'block',
    width: 'inherit'
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%'
  },
  header: {
    height: '20%',
    backgroundColor: 'lightGray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
