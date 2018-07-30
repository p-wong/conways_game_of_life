// 1. Any live cell with fewer than two live neighbors dies, as if by under population.
// 2. Any live cell with two or three live neighbors lives on to the next generation.
// 3. Any live cell with more than three live neighbors dies, as if by overpopulation.
// 4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

var board = []

initiate()

function initiate() {

  //Initiates the structure for the board (randomly sets cells as dead or alive)
  for (let rows = 0 ; rows < 50; rows++) {
    board[rows] = new Array()
    for (let cols = 0; cols < 50; cols++) {
      board[rows][cols] = Math.round(Math.random())
    }
  }
  updateBoard()
}

function updateBoard() {

  //Initiates the structure for the next board
  var nextBoard = new Array()
  for (let rows = 0; rows < board.length; rows++) {
    nextBoard[rows] = new Array()
  }

  //Checks if the current cell is alive or dead
  function checkIfCurrCellIsAlive(currRow, currCol) {
    return board[currRow][currCol]
  }

  //Checks if any neighboring cell is out of bound
  function outOfBounds(neighborRow, neighborCol) {
    return neighborRow < 0 ||
          neighborRow > board.length - 1 ||
          neighborCol < 0 ||
          neighborCol > board[0].length - 1
  }

  //Checks if the neighboring cell is the current cell
  function currentCell(neighborRow, neighborCol, currRow, currCol) {
    return neighborRow === currRow && neighborCol === currCol
  }

  //Counts the number of neighbor cells that are alive
  function aliveNeighborCount(currRow, currCol) {
    count = 0
    for (let neighborRow = currRow - 1; neighborRow <= currRow + 1; neighborRow++) {
      for (let neighborCol = currCol - 1; neighborCol <= currCol + 1; neighborCol++) {

        if (outOfBounds(neighborRow, neighborCol) || currentCell(neighborRow, neighborCol, currRow, currCol)) {
          continue
        }

        if (board[neighborRow][neighborCol] === 1) {
          count++
        }
      }
    }
    return count
  }

  //Makes the cell in the next board alive
  function makeCellAlive(currRow, currCol) {
    nextBoard[currRow][currCol] = 1
  }

  //Makes the cell in the next board dead
  function makeCellDead(currRow, currCol) {
    nextBoard[currRow][currCol] = 0
  }

  //For alive cell - checks how many alive neighbors there are, and according to the rules, changes the cell in the next board alive or dead
  function changeCurrAliveCell(currRow, currCol) {
    if (aliveNeighborCount(currRow, currCol) < 2 || aliveNeighborCount(currRow, currCol) > 3) {
      makeCellDead(currRow, currCol)
    } else {
      makeCellAlive(currRow, currCol)
    }
  }

  //For dead cell - checks how many alive neighbors there are, and according to the rules, changes the cell in the next board alive or dead
  function changeCurrDeadCell(currRow, currCol) {
    if (aliveNeighborCount(currRow, currCol) === 3) {
      makeCellAlive(currRow, currCol)
    } else {
      makeCellDead(currRow, currCol)
    }
  }

  //Updates the next board
  for (let currRow = 0; currRow < board.length; currRow++) {
    for (let currCol = 0; currCol < board[0].length; currCol++) {
      if (checkIfCurrCellIsAlive(currRow, currCol)) {
        changeCurrAliveCell(currRow, currCol)
      } else {
        changeCurrDeadCell(currRow, currCol)
      }
    }
  }

  board = nextBoard;

  drawCells();
}

//Draws the cells for the boards, and updates the board every .1 second
function drawCells() {
  var canvas = document.getElementById('canvas').getContext('2d')
  canvas.strokeStyle = '#484f5b'
  canvas.fillStyle = '#a9bbd8'
  canvas.clearRect(0, 0, 2000, 2000)
  board.forEach(function(row, x) {
    row.forEach(function(cell, y) {
      canvas.beginPath()
      canvas.rect(x*12, y*12, 8, 8)
      if (cell) {
        canvas.fill();
      } else {
        canvas.stroke();
      }
    })
  })
  setTimeout(function() { updateBoard() }, 100)
}
