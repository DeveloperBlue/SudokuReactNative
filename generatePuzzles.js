let {sudoku_generator} = require("./sudokuGenerator");
let fs = require("fs");

let difficulties = ["easy", "medium", "hard", "insane"];

let games = {
}

for (difficulty of difficulties){

	games[difficulty] = {}

	for (let i = 1; i <= 40; i++){
		games[difficulty][i] = sudoku_generator.generate(difficulty);
	}

}

fs.writeFileSync("game_levels.json", JSON.stringify(games, null, '\t'))