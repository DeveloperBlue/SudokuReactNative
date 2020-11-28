let indexTracker = {

	//////////////////////////////////////
	/////////////////////////////////////
	
	stringIndexToGridItem_Table : {}, // eg. "top_left_i2" --> 1
	gridItemToStringIndex_Table : {},  // eg. 27 --> "middle_left_i1"

	getStringIndexFromGridItem : function(gridItemID){
		return indexTracker.gridItemToStringIndex_Table[gridItemID];
	},

	getGridItemFromStringIndex : function(stringIndex){
		return indexTracker.stringIndexToGridItem_Table[stringIndex];
	},

	//////////////////////////////////////
	/////////////////////////////////////

	// Inputs:
		// stringIndex (num) eg. 23
		// gridItem (string) eg. top_left_i2
		// table (object) eg. {row : <num>, col : <num>}

	getTracker : function(inputs){

		// Smart validation


		// Expects an object without "row" in it

		if ((typeof inputs !== "object") || (typeof inputs == "object" && "row" in inputs)){
			let input_validation = {};
			if (typeof inputs == "string"){
				input_validation.gridItem = inputs;
			} else if (!isNaN(parseInt(inputs))){
				input_validation.stringIndex = inputs.toString();
			} else if ("row" in inputs){
				input_validation.table = inputs;
			} else {
				// Some real invalid stuff got passed over huh . . .
			}
			inputs = input_validation;
		}
		
		//

		let outputTracker = {
			stringIndex : inputs.stringIndex,
			gridItem : inputs.gridItem,
			table : inputs.table
		}

		// todo
		// check if the provided inputs have at least one filled

		if (outputTracker.stringIndex == undefined){
			if (outputTracker.gridItem){
				// gridItem to stringIndex
				outputTracker.stringIndex = indexTracker.getStringIndexFromGridItem(outputTracker.gridItem);
			} else if (outputTracker.table){
				// table to stringIndex
				outputTracker.stringIndex = (outputTracker.table.row * 9) + outputTracker.table.col;
			} 
		}

		if (outputTracker.gridItem == undefined){
			// stringIndex to gridItem
			outputTracker.gridItem = indexTracker.getGridItemFromStringIndex(outputTracker.stringIndex);
		}

		if (outputTracker.table == undefined){
			// stringIndex to table
			outputTracker.table = {
				row : (outputTracker.stringIndex - (outputTracker.stringIndex % 9))/9,
				col : outputTracker.stringIndex % 9
			}
		}

		return outputTracker;

	},

	ofRow : {},
	ofColumn : {},

}


function generateIndexTrackerHelpers(){
	// Get the string index for the first item in each subgrid
	let indexTracker_origins = {
		"top_left" : (9 * 0),
		"top_middle" : (9 * 0) + 3,
		"top_right" : (9 * 0) + 6,

		"center_left" : (9 * 3),
		"center_middle" : (9 * 3) + 3,
		"center_right" : (9 * 3) + 6,

		"bottom_left" : (9 * 6),
		"bottom_middle" : (9 * 6) + 3,
		"bottom_right" : (9 * 6) + 6,
	}

	// Build string index from grid id table . . .
	for (let [subgrid, initial_index] of Object.entries(indexTracker_origins)){

		// count 3, skip 6, count 3, skip 6, count 3
		let current_index = initial_index - 1;
		let skip_count = 0;

		for (let i = 1; i < 10; i++){

			indexTracker.gridItemToStringIndex_Table[`${subgrid}_i${i}`] = ++current_index;

			skip_count++;
			if (skip_count >= 3 ){
				skip_count = 0;
				current_index = current_index + 6;
			}
		}

	}

	// Invert table for grid id from string index table . . .

	for (let [gridItemID, stringIndex] of Object.entries(indexTracker.gridItemToStringIndex_Table)){
		indexTracker.stringIndexToGridItem_Table[stringIndex, gridItemID];
	}

	// Create ofRow and ofColumn
}



generateIndexTrackerHelpers();


export default indexTracker