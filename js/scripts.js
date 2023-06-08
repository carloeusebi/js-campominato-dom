// DOM Elements
const field = document.getElementById('field');
const difficultyInput = document.getElementById('difficulty');
const highScoreOutput = document.getElementById('high-score');
const currentScoreOutput = document.getElementById('current-score');
const playButton = document.getElementById('play-button');
const smile = playButton.querySelector('img')

const numberOfMines = 16;
const mineImage = `<img src="img/mine.png" alt="mine">`;
const flagImage = `<img src="img/flag.png" class="flag" alt="flag">`;
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

/**
 * Checks if a given cell is a mine based on its position in the field and the array the mines position
 * @param {number} cell the position of the cell
 * @param {array} minesArray the array containing all the mines positions
 * @returns {boolean} wheter the cell is included or not
 */
const isMine = (cell, minesArray) => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    let isMine = false;

    for (let mine of minesArray) {
        if (mine[0] === x && mine[1] === y) isMine = true;
    }

    return isMine;
}

function cellClick() {

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

            // renders the mines on the field after the game over
            if (isMine(cell, mines)) {
                cell.innerHTML = mineImage;
                cell.classList.add('clicked');
            }
        }
    }

    const getNearbyMines = (cell, mines) => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        let nearbyMines = 0;

        let topLeft;
        let top;
        let topRight;
        let right;
        let bottomRight;
        let bottom;
        let bottomLeft;
        let left;

        let validNeighbours = [];

        if (x > 0) {
            top = cellsMatrix[x - 1][y];
            validNeighbours.push(top);

            if (y > 0) {
                topLeft = cellsMatrix[x - 1][y - 1];
                validNeighbours.push(topLeft);
            }
            if (y < cellsMatrix[0].length - 1) {

                topRight = cellsMatrix[x - 1][y + 1];
                validNeighbours.push(topRight);
            }
        }

        if (x < cellsMatrix[0].length - 1) {
            if (y < cellsMatrix[0].length - 1) {
                bottomRight = cellsMatrix[x + 1][y + 1];
                validNeighbours.push(bottomRight);
            }
            bottom = cellsMatrix[x + 1][y];
            validNeighbours.push(bottom);
            if (y > 0) {
                bottomLeft = cellsMatrix[x + 1][y - 1];
                validNeighbours.push(bottomLeft);
            }
        }

        if (y > 0) {
            left = cellsMatrix[x][y - 1];
            validNeighbours.push(left);
        }
        if (y < cellsMatrix[0].length - 1) {
            right = cellsMatrix[x][y + 1];
            validNeighbours.push(right);
        }

        for (let neighbour of validNeighbours) {
            if (isMine(neighbour, mines)) nearbyMines++;
        }

        console.log(validNeighbours);
        if (nearbyMines) {
            cell.innerText = nearbyMines;
        } else {
            for (let neighbour of validNeighbours) {
                if (!neighbour.classList.contains('clicked')) {
                    neighbour.classList.add('clicked');
                    getNearbyMines(neighbour, mines);
                }
            }
        }

    }

    if (isMine(this, mines)) {
        gameOver(this);
        return;
    }

    // checks if the current cell was already clicked, and only if it WASN'T, it increments the score
    if (!this.classList.contains('clicked')) {
        currentScore++;
        currentScoreOutput.innerText = currentScore;
    }

    getNearbyMines(this, mines);

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
        const createCell = (x, y) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            return cell;
        }

        const rows = Math.sqrt(numberOfCells);
        const cols = rows;
        let matrix = [];

        for (let i = 0; i < rows; i++) {
            matrix[i] = []
            for (let j = 0; j < cols; j++) {
                const cell = createCell(i, j);
                field.appendChild(cell)

                matrix[i][j] = cell;

                cell.addEventListener('click', cellClick);

                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    cell.innerHTML = flagImage;
                })
            }
        }

        //class assegnation decides how big the cells are
        field.className = difficulty;

        return matrix;
    }

    /**
    * Generates 16 mines at random positions, and return an array containing the positions
    * BOMBS ARE STORED IN AN ARRAY AS POSITIONS AND NOT IN THE HTML TO PREVENT USER FROM CHEATING :D
    * @param {number} max the number of cells, mines should not be placed in non existing cells
    * @returns {[array]}
    */
    const generateMines = (numberOfCells, numberOfMines) => {

        const getRndNumber = max => Math.floor(Math.random() * max);
        const mines = [];
        const max = Math.sqrt(numberOfCells);

        while (mines.length < numberOfMines) {
            const mineX = getRndNumber(max);
            const mineY = getRndNumber(max);
            let isNewMine = true;

            for (let mine of mines) {
                if (mine[0] === mineX && mine[1] === mineY) isNewMine = false;
            }

            if (isNewMine) mines.push([mineX, mineY]);
        }

        return mines;
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
    cellsMatrix = renderField(field, numberOfCells, difficulty);

    // randomly generates 10 mines
    mines = generateMines(numberOfCells, numberOfMines);

    // grab all the cells in an array, it will be used after game over to remove event listeners and to show all the mines on screen
    cells = field.getElementsByClassName('cell');
}

/*********************************************** */
/*** MAIN ************************************** */
/*********************************************** */


playButton.addEventListener('click', startGame);

difficultyInput.addEventListener('change', startGame);



