// DOM Elements
const field = document.getElementById('field');
const difficultyInput = document.getElementById('difficulty');
const highScoreOutput = document.getElementById('high-score');
const currentScoreOutput = document.getElementById('current-score');
const playButton = document.getElementById('play-button');
const smile = playButton.querySelector('img')
const winText = document.getElementById('win-text');

const numberOfMines = 16;
const mineImage = `<img src="img/mine.png" alt="mine">`;
const flagImage = `<img src="img/flag.png" class="flag" alt="flag">`;
const smilePlay = 'img/smile.png';
const smileOver = 'img/gameover.png';

let numberOfCells;
let cellsMatrix = [];
let cells = [];
let mines = [];
let currentScore = 0;
let highScore = 0;
let maxScore = 0;
let firstMove;

/*********************************************** */
/*** FUNCTIONS ********************************* */
/*********************************************** */

function toggleFlag(cell, e) {
    e.preventDefault();

    if (!cell.classList.contains('clicked')) {

        if (cell.hasAttribute('data-flag')) {
            cell.innerHTML = ''
            cell.removeAttribute('data-flag');
        } else {
            cell.innerHTML = flagImage;
            cell.setAttribute('data-flag', '');
        }
    }
}


function cellClick() {

    /**
* Generates 16 mines at random positions, and return an array containing the positions
* @param {number} numeberOfCells the number of cells, mines should not be placed in non existing cells
* @param {number} numberOfMines the total number of mines to generate
* @returns {[array]}
*/
    const generateMines = (numberOfCells, numberOfMines, firstCell) => {

        const getRndNumber = max => Math.floor(Math.random() * max);
        const isNotNewMine = (x, y, mine) => mine[0] === x && mine[1] === y;
        const isNotFirstCell = (x, y, cell) => parseInt(cell.dataset.x) !== x && parseInt(cell.dataset.y) !== y;

        const newMines = [];
        const max = Math.sqrt(numberOfCells);

        while (newMines.length < numberOfMines) {
            const mineX = getRndNumber(max);
            const mineY = getRndNumber(max);
            let isNew = true;

            for (let mine of newMines) {
                if (isNotNewMine(mineX, mineY, mine)) isNew = false;
            }
            if (isNew && isNotFirstCell(mineX, mineY, firstCell)) newMines.push([mineX, mineY]);
        }
        return newMines;
    }


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

    /**
     * Handles the gameover procedure
     * @param {node} thisCell the clicked cell
     * @param {boolean} win normally false, if true triggers behaveiours of player victory
     */
    const gameOver = (thisCell, win = false) => {

        if (win) winText.classList.remove('hidden');
        else {
            thisCell.classList.add('exploded');
            smile.src = smileOver;
        }

        // replaces the smile button with a game over smile x_x

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

    /**
     * get the number of nearby mines when a cell is clicked
     * @param {node} cell the cell that wants to count the nearby mines
     * @param {array} mines nearby
     */
    const getNearbyMines = (cell, mines) => {

        /**
         * it returns the valid neighbours of a cell, if a cell is on the edge of the field
         * @param {node} cell the cell which we want to know the valid neighbours
         * @returns {array} an array containing the valid neighbour nodes
         */
        const getValidNeighbours = cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            let validNeighbours = [];

            if (x > 0) {
                validNeighbours.push(cellsMatrix[x - 1][y]);

                if (y > 0) {
                    validNeighbours.push(cellsMatrix[x - 1][y - 1]);
                }
                if (y < cellsMatrix[0].length - 1) {
                    validNeighbours.push(cellsMatrix[x - 1][y + 1]);
                }
            }

            if (x < cellsMatrix[0].length - 1) {
                if (y < cellsMatrix[0].length - 1) {
                    validNeighbours.push(cellsMatrix[x + 1][y + 1]);
                }
                validNeighbours.push(cellsMatrix[x + 1][y]);
                if (y > 0) {
                    validNeighbours.push(cellsMatrix[x + 1][y - 1]);
                }
            }

            if (y > 0) {
                validNeighbours.push(cellsMatrix[x][y - 1]);
            }
            if (y < cellsMatrix[0].length - 1) {
                validNeighbours.push(cellsMatrix[x][y + 1]);
            }

            return validNeighbours;
        }

        /**
         * Given the number of nearby mines it return the css class name to color the number
         * @param {number} number the number of nearby mines
         * @returns {string} the nameo of the css class to color the cell
         */
        const getColor = number => {
            switch (number) {
                case 1:
                    return 'blue';
                case 2:
                    return 'green';
                case 3:
                    return 'red';
                case 4:
                    return 'darkblue';
                case 5:
                    return 'darkred';
                case 6:
                    return 'aqua';
                case 7:
                    return 'black';
                case 8:
                    return 'gray';
            }
        }

        const validNeighbours = getValidNeighbours(cell);

        let nearbyMines = 0;

        for (let neighbour of validNeighbours) {
            if (isMine(neighbour, mines)) nearbyMines++;
        }


        if (nearbyMines) {
            cell.innerText = nearbyMines;
            const color = getColor(nearbyMines);
            cell.classList.add(color);
        } else {
            for (let neighbour of validNeighbours) {
                if (!neighbour.classList.contains('clicked')) {
                    neighbour.classList.add('clicked');
                    getNearbyMines(neighbour, mines);
                }
            }
        }
        currentScore++;

    }

    if (firstMove) {
        mines = generateMines(numberOfCells, numberOfMines, this);
        firstMove = false;
    }

    if (isMine(this, mines)) {
        gameOver(this);
        return;
    }

    if (!this.classList.contains('clicked')) {
        this.classList.add('clicked');
        getNearbyMines(this, mines);
        currentScoreOutput.innerText = currentScore;
    }

    if (currentScore >= maxScore) {
        const win = true;
        gameOver(this, win);
    }


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

                cell.addEventListener('contextmenu', function (e) {
                    toggleFlag(this, e);
                })
            }
        }

        //class assegnation decides how big the cells are
        field.className = difficulty;

        return matrix;
    }

    // FIELD RESET
    field.innerHTML = ``;
    currentScoreOutput.innerText = currentScore = 0;
    smile.src = smilePlay;
    winText.classList.add('hidden');
    firstMove = true;

    // there is no need to validate difficulty input, the program can handles different values from expected ones and it will default to a medium difficulty
    const difficulty = difficultyInput.value;

    // from difficulty calculates the number of cell to render
    numberOfCells = getNumberOfCells(difficulty);
    maxScore = numberOfCells - numberOfMines;

    // renders the field
    cellsMatrix = renderField(field, numberOfCells, difficulty);



    // grab all the cells in an array, it will be used after game over to remove event listeners and to show all the mines on screen
    cells = field.getElementsByClassName('cell');
}

/*********************************************** */
/*** MAIN ************************************** */
/*********************************************** */


playButton.addEventListener('click', startGame);

difficultyInput.addEventListener('change', startGame);

