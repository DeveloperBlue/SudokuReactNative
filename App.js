import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Image, FlatList } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MenuScreen from './screens/MenuScreen';
import LevelsScreen from './screens/LevelsScreen';
import GameScreen from './screens/GameScreen';

const Stack = createStackNavigator();


/* PAGINATION */

const App = () => {
	return (
		<NavigationContainer>
		<Stack.Navigator

			initialRouteName="Menu"

			screenOptions = {{
				headerShown: false
			}}>

			<Stack.Screen
			name="Menu"
			component={MenuScreen}
			options={{ title: 'Menu' }}
			/>
			<Stack.Screen
			name="Levels"
			component={LevelsScreen}
			options={{ title: 'Levels' }}
			/>
			<Stack.Screen
			name="Game"
			component={GameScreen}
			options={{ title: 'Game' }}
			/>
			
		</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
