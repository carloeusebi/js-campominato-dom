# MINEFIELD
## By Carlo Eusebi
 
<hr>

**Target:**<br>
Update previous project and add more complexity adding full ruleset of minesweeper:
- On cell click it will display the number of adjacent cells;
- On cell click, if a nearby cell has no nearby cell it will set hitself as if it was clicked;
- Add endgame condition.
- Add flags on right click.

<br>

**Steps**:
- Clear and refactor current code.
- Field is a Matrix, cells will be referenced with coordinates not only position, in the format: <br>
 ```
  cell[row][column]
 ```
- Mines will be updated too: they will reference coordinates in the matrix;
- At every cell click if cell is not bomb the cell will check its 8 neighbours and count the mines:<br>
```javascript
cell[row-1][col-1]
cell[row-1][col]
cell[row-1][col+1]
...
```
- If the cell has neighbour mines it will display how many there are;
- If the cell has no neighbour mines it will check each neighbour mines and count the mines number, if therare no mines it will click them and check neighbour's neighbours.
- Enstablish what is max score based on current difficulty level, at every click check if current score is max score;
- Add a winning message;
- On right click adds flag object inside cell.
