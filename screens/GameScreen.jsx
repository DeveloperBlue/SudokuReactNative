import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Image, FlatList } from 'react-native';

import {sudoku_generator} from './../sudokuGenerator';
import indexTracker from "./../indexTracker";

//

let grid_item_selected_bkg_color = "";
let grid_item_selected_text_color = "";

const GameScreen = ({ navigation, route }) => {

	//
	let difficulty = route.params.difficulty;
	let level_no = route.params.level_no;
	let game_levels = route.params.game_levels;

	//


	const sudoku_string_master = game_levels[difficulty.toLowerCase()][level_no];
	const [sudoku_string_play, setSudokuString] = useState(sudoku_string_master + "");
	const sudoku_solution = sudoku_generator.solve(sudoku_string_play);

	const [history, updateHistory] = useState([]);

	//

	const [selectedSubgridItem, setSelectedSubgridItem] = useState();
		// grid-key id (eg. center_left_2)

	// Valid states: 'enabled', 'disabled', 'active'
	const [buttonHiglights, updateButtonHighlights] = useState({
		"b1" : "enabled", 
		"b2" : "enabled",
		"b3" : "enabled",
		"b4" : "enabled",
		"b5" : "enabled",
		"b6" : "enabled",
		"b7" : "enabled",
		"b8" : "enabled",
		"b9" : "enabled",
	})

	const updateNumberButtons = () => {

		// if the 'selectedSubgridItem' is immutable, disable buttons
		// otherwise, highlight the number that 'selectedSubgridItem' holds as a value

		let stringIndex = indexTracker.getTracker({gridItem : selectedSubgridItem}).stringIndex;

		if (sudoku_string_master[stringIndex] !== "."){

			// Item is immutable, disable the buttons.

			updateButtonHighlights({
				"b1" : "disabled", 
				"b2" : "disabled",
				"b3" : "disabled",
				"b4" : "disabled",
				"b5" : "disabled",
				"b6" : "disabled",
				"b7" : "disabled",
				"b8" : "disabled",
				"b9" : "disabled",
			})

		} else if (sudoku_string_play[stringIndex] == "."){
			// Item is mutable, but has no value. Make all buttons normal

			updateButtonHighlights({
				"b1" : "enabled", 
				"b2" : "enabled",
				"b3" : "enabled",
				"b4" : "enabled",
				"b5" : "enabled",
				"b6" : "enabled",
				"b7" : "enabled",
				"b8" : "enabled",
				"b9" : "enabled",
			})

		} else {
			// Item is mutable, but has a current value. Highlight that specific button.

			let currentValue = sudoku_string_play[stringIndex];

			(currentValue == 1) ? "active" : "enabled",

			updateButtonHighlights({
				"b1" : (currentValue == 1) ? "active" : "enabled", 
				"b2" : (currentValue == 2) ? "active" : "enabled", 
				"b3" : (currentValue == 3) ? "active" : "enabled", 
				"b4" : (currentValue == 4) ? "active" : "enabled", 
				"b5" : (currentValue == 5) ? "active" : "enabled", 
				"b6" : (currentValue == 6) ? "active" : "enabled", 
				"b7" : (currentValue == 7) ? "active" : "enabled", 
				"b8" : (currentValue == 8) ? "active" : "enabled", 
				"b9" : (currentValue == 9) ? "active" : "enabled", 
			})
		}

	}


	const handleUndoPressed = () => {

		if (history.length == 0) return;

		let undoItem = history.pop();
		updateHistory(history);

		// change item at undoItem.index from undoItem.newValue to undoItem.previousValue;

		updateSudokuString(undoItem.stringIndex, undoItem.previousValue, true);
	}

	const handleErasePressed = () => {
		// is selected item writeable and non-empty?
		// set value to empty, push to history

		let stringIndex = indexTracker.getTracker({gridItem : selectedSubgridItem}).stringIndex;

		if (sudoku_string_master[stringIndex] !== ".") return; // Item is immutable
		if (sudoku_string_play[stringIndex] == ".") return; // Item is already clear

		updateSudokuString(stringIndex, ".");
	}

	const handleHintPressed = () => {

		// Check for empty items, add the correct value
			// todo, animate a blink at that cell
		// If no empty items, compare current board to solution to identify where player went wrong (or highlight overlaps red?)

		let stringIndex = sudoku_string_play.indexOf(".");
		if (stringIndex == -1){
			alert ("No available hints");
			return;
		}

		let solutionValue = sudoku_solution[stringIndex];

		updateSudokuString(stringIndex, solutionValue, true);
	}

	//



	// Click item in grid --> higlight grid item, rerender button bar based on mutability and value, do grid/row/col/num highlighting
	// Press number key --> update grid item, rerender button bar based on value, do grid/row/col/num highlighting
	// Erase --> update grid item, rerender button bar based on value, do grid/row/col/num highlighting
	// Undo --> update grid item, rerender button bar if applicable, do grid/row/col/num highlighting if applicable

	//

	//////////////////////////////////////////////////////
	
	// Update sudoku string

	function updateSudokuString(stringIndex, value, skipAddToHistory){

		// Replace character in sudoku string . . .
		function getNewSudokuString(stringIndex, value){
			let str = sudoku_string_play + ""
			if (stringIndex > str.length - 1) return str;
	    	return str.substring(0, stringIndex) + value + str.substring(stringIndex + 1);
		}

		let updatedSudokuString = getNewSudokuString(stringIndex, value);

		if (!skipAddToHistory){
			history.push({
				stringIndex : stringIndex,
				previousValue : sudoku_string_play[stringIndex],
				newValue : updatedSudokuString[stringIndex]
			})
			updateHistory(
				history
			)
		}

		setSudokuString(updatedSudokuString);

	}

	//

	const [gridItemHighlights, updateGridItemHighlights] = useState({});

	// Red higlight duplicates in rows,
	// Bold other areas the number appears
	// Dark highlight the row and column background
	const highlightRelevantGridItems = () => {

		let currentIndexItem = indexTracker.getTracker({gridItem : selectedSubgridItem});
		let stringIndex = currentIndexItem.stringIndex;

		let currentSelectedValue = sudoku_string_play[stringIndex];

		let newGridItemHighlights = {};

		// TODO
		// MORE EFFICIENT
		// Pass row && col props to each cell
		// cells check if the current row and col match, and if the current values match, then apply their css
		// no need to loop through them all!


		for (let i = 0; i < sudoku_string_play.length; i++){

			let indexItemBeta = indexTracker.getTracker({stringIndex : i});

			let isOfSameTable = (stringIndex !== i) && (indexItemBeta.table.row == currentIndexItem.table.row) && (indexItemBeta.table.col == currentIndexItem.table.col);
			let hasDuplicateValue = (currentSelectedValue !== ".") && (currentSelectedValue == sudoku_string_play[indexItemBeta.stringIndex]);

			if (isOfSameTable && hasDuplicateValue){
				// Encountered a BAD duplicate
				// Mutable objects get a red background, immutable objects get red text.

				newGridItemHighlights[i.toString()] = "duplicate";

			} else if (isOfSameTable){
				// Highlight the row and column with a darker bkg

				newGridItemHighlights[i.toString()] = "table";

			} else if (hasDuplicateValue){
				// Bold the text for these items

				newGridItemHighlights[i.toString()] = "similar"
			}

		}

		

		updateGridItemHighlights(newGridItemHighlights);

	}


	useEffect(() => {
		
	}, [gridItemHighlights])

	// Item pressed in grid
		// Highlight grid item
		// Rerender button bar based on mutability and value
		// Do grid/row/col/num highlighting

	useEffect(() => {

		updateNumberButtons();
		highlightRelevantGridItems();

	}, [selectedSubgridItem]);

	// Number button pressed
		// Update grid item

	const handleNumberPressed = (number) => {

		let stringIndex = indexTracker.getTracker({gridItem : selectedSubgridItem}).stringIndex;

		if (sudoku_string_master[stringIndex] !== ".") return; // Item is immutable

		// If the current value is the button pressed, clear the value
		// Otherwise, set to pressed value

		updateSudokuString(stringIndex, (sudoku_string_play[stringIndex] == number) ? "." : number);

	}

	// Sudoku cell updated . . .
		// Check for completion
		// Rerender button bar based on value
		// Do grid/row/col/num highlighting

	useEffect(() => {

		if (sudoku_string_play.indexOf(".") == -1){
			// sudoku has been filled in!
			// compare to solution . . .
			if (sudoku_string_play == sudoku_solution){
				alert("You solved it!")
			} else {
				alert("Not a valid solution . . .")
			}
		}

		updateNumberButtons();
		highlightRelevantGridItems();

	}, [sudoku_string_play]);


	////////////////////////////////////////////////////
	
	const Subgrid = ({subgridID}) => (
		<View style={[gameStyles.subgrid, gameStyles[`subgrid_${subgridID}`]]}>
			{	
				[
					`${subgridID}_i1`, `${subgridID}_i2`, `${subgridID}_i3`,
					`${subgridID}_i4`, `${subgridID}_i5`, `${subgridID}_i6`,
					`${subgridID}_i7`, `${subgridID}_i8`, `${subgridID}_i9`,
				].map(function(num){
					return SubgridItem({subgridID: subgridID, place : num, stringIndex : indexTracker.getTracker({gridItem : num}).stringIndex});
				})
			}
		</View>
	)

	const SubgridItem = ({subgridID, place, stringIndex}) => (
		<View style={gameStyles.subgridItemContainer}>
			<TouchableHighlight
				activeOpacity={1}
				underlayColor={'#f9f9f9'}
				style={[gameStyles.subgridItemHighlight, (selectedSubgridItem == place) ? {backgroundColor :  "#e6e6e6"} : null, (gridItemHighlights[stringIndex] == "table") ? {backgroundColor : "#000000"} : null, (gridItemHighlights[stringIndex] == "duplicate") ? {backgroundColor : "red"} : null]}
				onPress={() => {
					setSelectedSubgridItem(place);
				}}
			>
			
				<Text style={[gameStyles.subgridItemText, (sudoku_string_master[stringIndex] == ".") ? {color : "#03a9f4"} : null, (gridItemHighlights[stringIndex] == "similar") ? {fontWeight : "bold"} : null, , (gridItemHighlights[stringIndex] == "duplicate") ? {color : "red"} : null]}>
					{`${sudoku_string_play[stringIndex] == "." ? "" : sudoku_string_play[stringIndex]}`}
				</Text>
			</TouchableHighlight>
		</View>
	)

	const NumberButton = ({number}) => (

		<TouchableHighlight
			activeOpacity={1}
			underlayColor={'transparent'}
			style={gameStyles.numberButton}
			onPress={() => {
				handleNumberPressed(number.replace("b", ""));
			}}
		>

			<Text style={[gameStyles.numberButtonText, gameStyles["numberButtonText_" + buttonHiglights[number]]]}>
				{number.replace("b", "")}
			</Text>
		</TouchableHighlight>
	)



	//

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
								source={require("./../assets/back.png")}
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
									source={require("./../assets/palette.png")}
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
									source={require("./../assets/settings.png")}
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

								return Subgrid({subgridID : subgridID});

							})
						}
					</View>

				</View>

				<View style={gameStyles.buttonContainer}>

					<View style={gameStyles.functionContainer}>

						<TouchableHighlight
							style={gameStyles.function_button}
							onPress={handleUndoPressed}
						>
						
							<View style={gameStyles.function_button_view}>
								<Image
									style = {gameStyles.function_button_img}
									source={require("./../assets/undo.png")}
								>

								</Image>

								<Text style={gameStyles.function_button_label}>Undo</Text>
							</View>
							
						</TouchableHighlight>

						<TouchableHighlight
							style={gameStyles.function_button}
							onPress={handleErasePressed}
						>
						
							<View style={gameStyles.function_button_view}>
								<Image
									style = {gameStyles.function_button_img}
									source={require("./../assets/eraser.png")}
								>

								</Image>

								<Text style={gameStyles.function_button_label}>Erase</Text>
							</View>
							
						</TouchableHighlight>

						<TouchableHighlight
							style={gameStyles.function_button}
							onPress={handleHintPressed}
						>
						
							<View style={gameStyles.function_button_view}>
								<Image
									style = {gameStyles.function_button_img}
									source={require("./../assets/hint.png")}
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
		color : "#000000"
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
	numberButtonText_active : {
		color : "#03a9f4",
		fontWeight : "bold"
	},
	numberButtonText_enabled : {
		color : "#000",
	},
	numberButtonText_disabled : {
		color : "#c5c5c5",
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

export default GameScreen;