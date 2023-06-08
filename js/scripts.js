// DOM Elements
const field = document.getElementById('field');
const difficultyInput = document.getElementById('difficulty');
const highScoreOutput = document.getElementById('high-score');
const currentScoreOutput = document.getElementById('current-score');
const playButton = document.getElementById('play-button');
const smile = playButton.querySelector('img')

const numberOfMines = 16;
const mineImage = `<img src="img/mine.png" alt="mine">`;
const smilePlay = 'img/smile.png';
const smileOver = 'img/gameover.png';

let cellsMatrix = [];
let cells = [];
let mines = [];
let currentScore = 0;
let highScore = 0;

/*********************************************** */
/*** FUNCTIONS ********************************* */
/*********************************************** */


function cellClick() {
    /**
     * Checks if a given cell is a mine based on its position in the field and the array the mines position
     * @param {number} cell the position of the cell
     * @param {array} minesArray the array containing all the mines positions
     * @returns {boolean} wheter the cell is included or not
     */
    const isMine = (cell, minesArray) => minesArray.includes(cell);

    /**
     * Handles the gameover procedure
     * @param {node} thisCell the clicked cell
     */
    const gameOver = thisCell => {
        thisCell.classList.add('exploded');

        // replaces the smile button with a game over smile x_x
        smile.src = smileOver;

        // checks if the current game score is new high score
        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreOutput.innerText = currentScore;
        }

        for (let cell of cells) {
            // removes the even listener to prevent user to click more cells after game over
            cell.removeEventListener('click', cellClick);
            const position = parseInt(cell.dataset.position);

            // renders the mines on the field after the game over
            if (isMine(position, mines)) {
                cell.innerHTML = mineImage;
                cell.classList.add('clicked');
            }
        }
    }

    const position = parseInt(this.dataset.position);
    if (isMine(position, mines)) {
        gameOver(this);
        return;
    }

    // checks if the current cell was already clicked, and only if it WASN'T, it increments the score
    if (!this.classList.contains('clicked')) {
        currentScore++;
        currentScoreOutput.innerText = currentScore;
    }
    this.classList.add('clicked');
}

function startGame() {
    /**
  * Returns the number of cells when inputed the result of the difficulty setting
  * @param {string} difficulty the difficulty setting inputted by the user
  * @returns {number} the number of cells
  */
    const getNumberOfCells = difficulty => {
        switch (difficulty) {
            case 'easy':
                return 100;
            case 'hard':
                return 49;
            default:
                return 81;
        }
    }

    /**
    * Creates and renders the minefield, given the element where to print them and the number of cells to print
    * @param {node} field the place where the nodes will be placed
    * @param {number} numberOfCells the number of cells (based on difficulty) the field will have
    * @param {string} difficulty the difficulty leve, it is used to give the field a class to render cells size based on how many there are
    */
    const renderField = (field, numberOfCells, difficulty) => {
        /**
         * Create a new cell element. The required number is the position where the cell will be placed in the field
         * @param {number} position the position in the field where the cell wil be located, it is needed to derminate if it will contain the bomb
         * @returns {Node}
         *  */
        const createCell = position => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.position = position;
            return cell;
        }

        //class assegnation decides how big the cells are
        field.className = difficulty;

        for (let i = 1; i <= numberOfCells; i++) {
            const cell = createCell(i);
            field.appendChild(cell);

            cell.addEventListener('click', cellClick);
        }
    }

    /**
    * Generates 16 mines at random positions, and return an array containing the positions
    * BOMBS ARE STORED IN AN ARRAY AS POSITIONS AND NOT IN THE HTML TO PREVENT USER FROM CHEATING :D
    * @param {number} max the number of cells, mines should not be placed in non existing cells
    * @returns {[array]}
    */
    const generateMines = max => {
        /**
     * Return a random number given the max number
     * @param {number} max the maximus value of the random number, ti should be the number of cells
     * @returns {number}
     */
        const getRndNumber = max => Math.floor(Math.random() * max) + 1;

        const mines = [];

        while (mines.length < numberOfMines) {
            const mine = getRndNumber(max);
            // to prevent generating to mines in the same cell we check that the new mine position is not included in the list of positions
            if (!mines.includes(mine)) mines.push(mine);

        }
        return mines;
    }

    const createMatrix = (cells, numberOfCells) => {
        const rows = Math.sqrt(numberOfCells);
        const cols = rows;
        let matrix = [];
        let index = 0;

        for (let i = 0; i < rows; i++) {
            matrix[i] = []
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = cells[index];
                index++;
            }
        }

        return matrix;
    }

    // FIELD RESET
    field.innerHTML = '';
    currentScoreOutput.innerText = currentScore = 0;
    smile.src = smilePlay;

    // there is no need to validate difficulty input, the program can handles different values from expected ones and it will default to a medium difficulty
    const difficulty = difficultyInput.value;

    // from difficulty calculates the number of cell to render
    const numberOfCells = getNumberOfCells(difficulty);

    // renders the field
    renderField(field, numberOfCells, difficulty);

    // randomly generates 10 mines
    mines = generateMines(numberOfCells);

    // grab all the cells in an array, it will be used after game over to remove event listeners and to show all the mines on screen
    cells = field.getElementsByClassName('cell');

    // creates the matrix
    cellsMatrix = createMatrix(cells, numberOfCells);

    console.log(cellsMatrix);
}

/*********************************************** */
/*** MAIN ************************************** */
/*********************************************** */


playButton.addEventListener('click', startGame);

difficultyInput.addEventListener('change', startGame);