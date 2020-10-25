import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Image, FlatList } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
					data={[
						{
							key : "Easy"
						},
						{
							key : "Medium"
						},
						{
							key : "Hard"
						},
						{
							key : "Expert"
						},
					]}
					renderItem={ ({item}) => {
						return (
							<TouchableHighlight
								style={styles.menuButton}
								onPress={() => {
									navigation.navigate('Levels', {
										difficulty : item.key
									})
								}}
							>
								<View style={styles.menuButtonView}>
									<Text style={styles.menuButtonText}>
										{item.key}
									</Text>
									<Text style={styles.menuButtonSubtext}>
										0/100
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

const LevelsScreen = ({ navigation, route }) => {

	let levels_list = [];
	for (let i = 1; i <= 100; i++){
		levels_list.push({
			key : i
		})
	}

	let difficulty = route.params.difficulty;
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
						source={require("./assets/home.png")}
					>

					</Image>
				</View>
				
			</TouchableHighlight>

			<View style={styles.levelsHeader}>
				<Text style={styles.levelsHeaderTop}>{difficulty}</Text>
				<Text style={styles.levelsHeaderBottom}>0/100</Text>
			</View>
			

			<View style={styles.levelsListView}>

				<FlatList
					data={levels_list}
					renderItem={ ({item}) => {
						return (
							<TouchableHighlight
								style={styles.levelButton}
								onPress={() => {
									navigation.navigate('Game', {
										difficulty : difficulty,
										level_no : item.key
									})
								}}
							>
								<View style={styles.levelButtonView}>
									<Text style={styles.levelButtonText}>
										{`Level ${item.key}`}
									</Text>
									<Text style={styles.levelButtonSubtext}>
										0:00:00
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




const GameScreen = ({ navigation, route }) => {

	let subgrid_reference = {};
	let difficulty = route.params.difficulty;
	let level_no = route.params.level_no;

	return (

		<View style={styles.container}>

			<StatusBar style="auto" />

			<View style={gameStyles.gameScreen}>

				<View style={gameStyles.topbar}>

					<TouchableHighlight
						style={gameStyles.backButton}
						onPress={() => {
							navigation.navigate('Levels')
						}}
					>
					
						<View style={gameStyles.back_button_view}>
							<Image
								style = {gameStyles.back_button_img}
								source={require("./assets/back.png")}
							>

							</Image>

							<Text style={gameStyles.backButtonText}>
								Back
							</Text>

						</View>

						
					</TouchableHighlight>

					<View style={gameStyles.topbar_right}>

						<TouchableHighlight
							style={gameStyles.topbar_right_button}
							onPress={() => {
								alert('Open Themes Menu')
							}}
						>
						
							<View>
								<Image
									style = {gameStyles.topbar_img_icon}
									source={require("./assets/palette.png")}
								>

								</Image>
							</View>
							
						</TouchableHighlight>

						<TouchableHighlight
							style={gameStyles.topbar_right_button}
							onPress={() => {
								alert('Open Settings Menu')
							}}
						>
						
							<View>
								<Image
									style = {gameStyles.topbar_img_icon}
									source={require("./assets/settings.png")}
								>

								</Image>
							</View>
							
						</TouchableHighlight>

					</View>

				</View>

				<View style={gameStyles.gameContainer}>
					<View style={gameStyles.gameHeader}>
						<Text style={gameStyles.difficultyText}>{difficulty.toUpperCase()}</Text>
						<Text>{`LEVEL ${level_no}`}</Text>
					</View>

					<View style={gameStyles.timerHeader}>
						<Text>10:00</Text>
					</View>
					

					{/* Main Sudoku Block*/}

					<View style={gameStyles.sudokuContainer}>

						{/* Spawn Subgrids */}
						{
							[
								"top_left", "top_middle", "top_right",
								"center_left", "center_middle", "center_right",
								"bottom_left", "bottom_middle", "bottom_right",
							].map(function(subgridID){

								let subgrid = Subgrid({subgridID : subgridID})
								subgrid_reference[subgridID] = subgrid
								return subgrid;

							})
						}
					</View>

				</View>

				<View style={gameStyles.buttonContainer}>

					<View style={gameStyles.functionContainer}>

						<TouchableHighlight
							style={gameStyles.function_button}
							onPress={() => {
								alert('Undo')
							}}
						>
						
							<View style={gameStyles.function_button_view}>
								<Image
									style = {gameStyles.function_button_img}
									source={require("./assets/undo.png")}
								>

								</Image>

								<Text style={gameStyles.function_button_label}>Undo</Text>
							</View>
							
						</TouchableHighlight>

						<TouchableHighlight
							style={gameStyles.function_button}
							onPress={() => {
								alert('Erase')
							}}
						>
						
							<View style={gameStyles.function_button_view}>
								<Image
									style = {gameStyles.function_button_img}
									source={require("./assets/eraser.png")}
								>

								</Image>

								<Text style={gameStyles.function_button_label}>Erase</Text>
							</View>
							
						</TouchableHighlight>

						<TouchableHighlight
							style={gameStyles.function_button}
							onPress={() => {
								alert('Hint')
							}}
						>
						
							<View style={gameStyles.function_button_view}>
								<Image
									style = {gameStyles.function_button_img}
									source={require("./assets/hint.png")}
								>

								</Image>

								<Text style={gameStyles.function_button_label}>Hint</Text>
							</View>
							
						</TouchableHighlight>

					</View>

					<View style={gameStyles.numbersContainer}>
						{
							[
								"b1", "b2", "b3",
								"b4", "b5", "b6",
								"b7", "b8", "b9",
							].map(function(num){
								return NumberButton({number : num})
							})
						}
					</View>

				</View>

			</View>

		</View>
	);
}

const Subgrid = ({subgridID}) => (
	<View style={[gameStyles.subgrid, gameStyles[`subgrid_${subgridID}`]]}>
		{	
			[
				`${subgridID}_i1`, `${subgridID}_i2`, `${subgridID}_i3`,
				`${subgridID}_i4`, `${subgridID}_i5`, `${subgridID}_i6`,
				`${subgridID}_i7`, `${subgridID}_i8`, `${subgridID}_i9`,
			].map(function(num){
				return SubgridItem({subgridID: subgridID, place : num})
			})
		}
	</View>
)

const SubgridItem = ({subgridID, place}) => (
	<View style={gameStyles.subgridItemContainer}>
		<TouchableHighlight
			style={gameStyles.subgridItemHighlight}
			onPress={() => {
				alert('//TODO: Functionality')
			}}
		>
		
			<Text style={gameStyles.subgridItemText}>
				4
			</Text>
		</TouchableHighlight>
	</View>
)

const NumberButton = ({number}) => (
	<TouchableHighlight
		style={gameStyles.numberButton}
		onPress={() => {
			alert(`${number} Selected . . .`)
		}}
	>

		<Text style={gameStyles.numberButtonText}>
			{number.replace("b", "")}
		</Text>
	</TouchableHighlight>
)

// STYLINGS

const gridThemeConfig = {
	sudokuGridBorderWidth : 2,
	sudokuGridBorderColor : "#efefef",
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


const gameStyles = StyleSheet.create({

	gameScreen : {
		flex : 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		padding : 30,
		paddingTop : 40,
	},

	// INNER CONTAINERS

	topbar : {
		marginTop : 10,
		height : 38,
		width : "100%",
		flexDirection : "row",
		justifyContent : "space-between",
		alignSelf : "flex-start",
	},

	gameContainer : {
		flex : 8,
		width : "100%",
		alignItems : "center",
		justifyContent : "center",
	},

	buttonContainer : {
		flex : 2,
		width : "100%",
		alignContent : "center",
		justifyContent : "center",
		marginBottom : 60
	},

	// TOPBAR SUBCONTAINER

		// BACK BUTTON

	backButton : {
		borderWidth : 2,
		borderRadius : 4,
		borderColor : "#444",
		alignItems : "center",
		justifyContent : "center",
		paddingLeft : 12,
		paddingRight : 12
	},

	back_button_view : {
		alignItems : "center",
		justifyContent : "space-between",
		flexDirection : "row"
	},

	back_button_img : {
		height : 22,
		width : 22,
		marginRight : 8
	},

	backButtonText : {
		color : "#444",
		textAlign : "right"
	},

	topbar_right : {
		width : 240,
		flexDirection : "row",
		alignItems : "flex-end",
		justifyContent : "flex-end",
	},
	
		// THEME BUTTON
		// SETTINGS BUTTON

	topbar_right_button : {
		height : "100%",
		width : 40,
		marginLeft: 5,
		alignItems : "center",
		justifyContent : "center",
	},

	topbar_img_icon : {
		height : 22,
		width : 22
	},

	// GAME SUBCONTAINER

		// HEADER

	gameHeader : {
		alignItems : "center",
		marginBottom : 10
	},

	difficultyText : {
		color : "#6687b8",
		fontSize : 26,
	},

		// TIMER

	timerHeader : {
		width : "100%",
		alignItems : "flex-end",
		color : "#eaeaea",
		paddingRight : 4
	},

		// GAME SQUARE CONTAINER

	sudokuContainer : {
		width : "100%",
		aspectRatio : 1,
		alignItems : "center",
		justifyContent : "space-between",
		flexDirection : "row",
		flexWrap : "wrap"
	},

	subgrid : {
		width : "33.33%",
		height : "33.33%",
		alignSelf : "flex-start",
		alignItems : "center",
		justifyContent : "space-between",
		flexDirection : "row",
		flexWrap : "wrap",
		padding : 2,
	},

	subgridItemContainer : {
		width : "33.33%",
		height : "33.33%",
		alignSelf : "flex-start",
		alignItems : "center",
		justifyContent : "center",
		padding : 2,
	},

	subgridItemHighlight : {
		width : "100%",
		height : "100%",
		alignItems : "center",
		justifyContent : "center",
		borderRadius : 4,
		backgroundColor : "#f9f9f9",
	},

	subgridItemText : {
	},

	// BUTTON SUBCONTAINER

		// GAME BUTTONS	

	functionContainer : {
		width : "100%",
		marginTop : 30,
		flexDirection : "row",
		justifyContent : "space-around",
		alignContent : "center"
	},

	function_button_view : {
		alignItems : "center",
		justifyContent : "center",
	},

	function_button_img : {
		height : 32,
		width : 32
	},

	function_button_label : {
		marginTop : 4,
		fontSize : 12
	},

		// NUMBER BUTTONS

	numbersContainer : {
		width : "100%",
		marginTop : 10,
		flexDirection : "row",
		justifyContent : "space-around",
		alignContent : "center"
	},

	numberButton : {
		padding : 10
	},

	numberButtonText : {
		fontSize: 34,
	},

	// GRID STYLINGS

	subgrid_top_middle : {
		borderLeftWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderRightWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderColor : gridThemeConfig.sudokuGridBorderColor
	},
	subgrid_bottom_middle : {
		borderLeftWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderRightWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderColor : gridThemeConfig.sudokuGridBorderColor
	},

	subgrid_center_left : {
		borderTopWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderBottomWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderColor : gridThemeConfig.sudokuGridBorderColor
	},
	subgrid_center_right : {
		borderTopWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderBottomWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderColor : gridThemeConfig.sudokuGridBorderColor
	},

	subgrid_center_middle : {
		borderLeftWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderRightWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderTopWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderBottomWidth : gridThemeConfig.sudokuGridBorderWidth,
		borderColor : gridThemeConfig.sudokuGridBorderColor,
	}
});

export default App;
