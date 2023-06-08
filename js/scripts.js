// DOM Elements
const matrix = document.getElementById('matrix');
const difficultyInput = document.getElementById('difficulty');
const highScoreOutput = document.getElementById('high-score');
const currentScoreOutput = document.getElementById('current-score');
const playButton = document.getElementById('play-button');
const smile = playButton.querySelector('img')

const mineImage = `<img src="img/mine.png" alt="mine">`;
const smilePlay = 'img/smile.png';
const smileOver = 'img/gameover.png';

let cells = [];
let mines = [];
let currentScore = 0;
let highScore = 0;

/*********************************************** */
/*** FUNCTIONS ********************************* */
/*********************************************** */

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
 * Return a random number given the max number
 * @param {number} max the maximus value of the random number, ti should be the number of cells
 * @returns {number}
 */
const getRndNumber = max => Math.floor(Math.random() * max) + 1;


/**
 * Generates 10 mines at random positions, and return an array containing the positions
 * BOMBS ARE STORED IN AN ARRAY AS POSITIONS AND NOT IN THE HTML TO PREVENT USER FROM CHEATING :D
 * @param {number} max the number of cells, mines should not be placed in non existing cells
 * @returns {[array]}
 */
const getMines = max => {
    const mines = [];

    while (mines.length < 10) {
        const mine = getRndNumber(max);
        // to prevent generating to mines in the same cell we check that the new mine position is not included in the list of positions
        if (!mines.includes(mine)) mines.push(mine);

    }
    return mines;
}


/**
 * Create a new cell element. The required number is the position where the cell will be placed in the matrix
 * @param {number} position the position in the matrix where the cell wil be located, it is needed to derminate if it will contain the bomb
 * @returns {Node}
 */
const createCell = position => {
    const cell = document.createElement('div');
    cell.className = 'cells';
    cell.dataset.position = position;
    return cell;
}

/**
 * Creates and renders the minefield, given the element where to print them and the number of cells to print
 * @param {node} matrix the place where the nodes will be placed
 * @param {number} numberOfCells the number of cells (based on difficulty) the matrix will have
 * @param {string} difficulty the difficulty leve, it is used to give the matrix a class to render cells size based on how many there are
 */
const renderField = (matrix, numberOfCells, difficulty) => {
    //class assegnation decides how big the cells are
    matrix.className = difficulty;

    for (let i = 1; i <= numberOfCells; i++) {
        const cell = createCell(i);
        matrix.appendChild(cell);

        cell.addEventListener('click', cellClick);
    }
}

/**
 * Checks if a given cell is a mine based on its position in the matrix and the array the mines position
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

/**
 * Handles what happens when a cell is clicked
 */
function cellClick() {
    console.log(this.dataset.position);

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

/*********************************************** */
/*** MAIN ************************************** */
/*********************************************** */


playButton.addEventListener('click', () => {

    // FIELD RESET
    matrix.innerHTML = '';
    currentScore = 0;
    smile.src = smilePlay;

    // there is no need to validate difficulty input, the program can handles different values from expected ones and it will default to a medium difficulty
    const difficulty = difficultyInput.value;

    // from difficulty calculates the number of cell to render
    const numberOfCells = getNumberOfCells(difficulty);

    // renders the field
    renderField(matrix, numberOfCells, difficulty);

    // randomly generates 10 mines
    mines = getMines(numberOfCells);

    // grab all the cells in an array, it will be used after game over to remove event listeners and to show all the mines on screen
    cells = matrix.getElementsByClassName('cells');

    // TODO remove, only for debug purposes
    console.log(mines);
})