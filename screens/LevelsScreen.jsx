import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Image, FlatList } from 'react-native';


const LevelsScreen = ({ navigation, route }) => {

	//

	let levels_list = [];
	
	let difficulty = route.params.difficulty;
	let level_count = route.params.level_count;
	let time_tracker = route.params.time_tracker;
	let game_levels = route.params.game_levels;

	for (let i = 1; i <= level_count; i++){
		levels_list.push({
			key : i
		})
	}

	//

	return (

		<View style={styles.levelsContainer}>

			<StatusBar style="auto" />

			<TouchableHighlight
				style={styles.levelsBackButton}
				onPress={() => {
					navigation.navigate('Menu')
				}}
			>
			
				<View>
					<Image
						style = {styles.levelsBackButtonIcon}
						source={require("./../assets/home.png")}
					>

					</Image>
				</View>
				
			</TouchableHighlight>

			<View style={styles.levelsHeader}>
				<Text style={styles.levelsHeaderTop}>{difficulty}</Text>
				<Text style={styles.levelsHeaderBottom}>{`0/${level_count}`}</Text>
			</View>
			

			<View style={styles.levelsListView}>

				<FlatList
					data={levels_list}
					renderItem={ ({item}) => {
						return (
							<TouchableHighlight
								style={styles.levelButton}
								onPress={() => {
									time_tracker[difficulty.toLowerCase()][item.key] = "0:00.00";
									navigation.navigate('Game', {
										difficulty : difficulty,
										level_no : item.key,
										game_levels : game_levels
									})
								}}
							>
								<View style={styles.levelButtonView}>
									<Text style={styles.levelButtonText}>
										{`Level ${item.key}`}
									</Text>
									<Text style={styles.levelButtonSubtext}>
										{
											`${(typeof time_tracker[difficulty.toLowerCase()][item.key] == "undefined") ? "" : time_tracker[difficulty.toLowerCase()][item.key]}`
										}
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
		borderRadius : 20,
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
		height : 80,
		paddingLeft : 24,
		borderRadius : 4,
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
		right : 10,
		bottom : -18
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


export default LevelsScreen;