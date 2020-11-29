import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Image, FlatList } from 'react-native';

//

let game_levels = require("./../game_levels");

let difficulties = [];
let time_tracker = {};

for (let difficulty of Object.keys(game_levels)){
	time_tracker[difficulty] = {};
	difficulties.push({
		"key" : difficulty[0].toUpperCase() + difficulty.substring(1, difficulty.length),
		"level_count" : Object.values(game_levels[difficulty]).length
	})
}

//

const MenuScreen = ({ navigation }) => {
	return (

		<View style={styles.menuContainer}>

			<StatusBar style="auto" />

			<View style={styles.logoView}>
				<View style={styles.logoTop}>
					<Text style={styles.logoTopText}>
						S
					</Text>
				</View> 
				<Text style={styles.logoBottom}>
					SUDOKU
				</Text>
			</View>

			<View style={styles.menuListView}>

				<FlatList
					data={difficulties}
					renderItem={ ({item}) => {
						return (
							<TouchableHighlight
								activeOpacity={1}
								underlayColor={'#1565c0'}
								style={styles.menuButton}
								onPress={() => {
									navigation.navigate('Levels', {
										difficulty : item.key,
										level_count : item.level_count,
										time_tracker : time_tracker,
										game_levels : game_levels
									})
								}}
							>
								<View style={styles.menuButtonView}>
									<Text style={styles.menuButtonText}>
										{item.key}
									</Text>
									<Text style={styles.menuButtonSubtext}>
										{`0/${item.level_count}`}
									</Text>
								</View>
								
								
							</TouchableHighlight>
						)
					}}
				>
					
				</FlatList>

			</View>
		</View>

	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},

	// MENU PAGE
	menuContainer : {
		flex: 1,
		backgroundColor: '#fff',
		padding : 40,
	},

		// MENU LOGO

	logoView : {
		flex : 2,
		alignItems : "center",
		justifyContent : "center"
	},

	logoTop : {
		alignItems : "center",
		justifyContent : "center",
		textAlign : "center",
		backgroundColor : "#007acc",
		borderRadius : 15,
		width : 120,
		height : 120
	},

	logoTopText : {
		textAlign : "center",
		fontSize : 74,
		color : "#fff",
		fontWeight : "bold"
	},

	logoBottom : {
		fontSize : 32,
		fontWeight : "100"
	},

	

		// MENU LIST & BUTTONS

	menuListView : {
		flex : 3
	},

	menuButton : {
		alignContent : "center",
		justifyContent : "center",
		backgroundColor : "#007acc",
		height : 60,
		paddingLeft : 24,
		borderRadius : 2,
		marginBottom : 10
	},

	menuButtonText : {
		color : "#fff",
		fontSize : 22
	},

	menuButtonSubtext : {
		color : "#fff",
		fontSize : 12,
		position : "absolute",
		textAlign : "right",
		right : 6,
		bottom : -10
	},

	// LEVELS PAGE

	levelsContainer : {
		flex: 1,
		backgroundColor: '#fff',
		padding : 20,
	},

		// LEVELS HEADER	
	levelsHeader : {
		flex : 1,
		alignItems : "center",
		justifyContent : "center",
	},

	levelsHeaderTop : {
		fontSize : 42
	},

	levelsHeaderBottom : {
		fontSize : 24
	},

		// LEVELS LIST & BUTTONS

	levelsListView : {
		flex : 3
	},

	levelButton : {
		alignContent : "center",
		justifyContent : "center",
		backgroundColor : "#007acc",
		height : 60,
		paddingLeft : 20,
		borderRadius : 2,
		marginBottom : 5
	},

	levelButtonText : {
		color : "#fff",
		fontSize : 18
	},

	levelButtonSubtext : {
		color : "#fff",
		fontSize : 12,
		position : "absolute",
		textAlign : "right",
		right : 6,
		bottom : -12
	},

		// LEVELS BACK BUTTON

	levelsBackButton  :{
		marginTop : 40,
		width : 62,
		height : 62,
		borderRadius : 50,
		backgroundColor : "#007acc",
		alignItems : "center",
		justifyContent : "center",
		padding : 10,
	},

	levelsBackButtonIcon : {
		width : 32,
		height : 32
	}
})


export default MenuScreen;