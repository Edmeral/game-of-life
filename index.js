'use strict'

function Grid(width, height) {
  this.width = width
  this.height = height
  this.cells = this.generateCells()
}

Grid.prototype.generateCells = function() {
  let cells = new Array(this.height)
  for (let i = 0; i < this.height; i++) {
    cells[i] = new Array(this.width)
    for (let j = 0; j < this.width; j++)
      cells[i][j] = false
  }
  return cells
}

Grid.prototype.clear = function() {
  this.cells = this.generateCells()
}

Grid.prototype.makeAlive = function(x, y) {
  this.cells[x][y] = true
}

// Check if a given coordinate is within the grid
Grid.prototype.isInside = function (x, y) {
  return x < this.width && x >= 0 && y < this.height && y >= 0
}

/* returns the state of the cell after one step
   Rules :
    1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    2. Any live cell with two or three live neighbours lives on to the next generation.
    3. Any live cell with more than three live neighbours dies, as if by over-population.
    4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
Grid.prototype.act = function (x, y) {
  let neighborsCoords = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
  let neighbors = neighborsCoords.map(coord => {
    let newX = x + coord[0], newY = y + coord[1]
    if (this.isInside(newX, newY)) 
      return this.cells[newX][newY]
    return false // if a neighbor is not within the grid, it can be considered dead
  })

  // Calculating the number of live neighboring cells
  let liveNeighborsCount = neighbors.reduce((count, neighbor) => count + (neighbor ? 1 : 0), 0)

  if (liveNeighborsCount < 2 || liveNeighborsCount > 3)
    return false
  if (liveNeighborsCount == 3)
    return true
  return this.cells[x][y]
}

// Generating the grid after one step
Grid.prototype.turn = function() {
  let newCells = this.generateCells()
  for (let x = 0; x < this.height; x++) {
    for (let y = 0; y < this.width; y++) {
      newCells[x][y] = this.act(x, y)
    }
  }
  this.cells = newCells
}

Grid.prototype.toDOM = function() {
  let gridDiv = document.querySelector('#grid')
  gridDiv.innerHTML = ""
  gridDiv.style.width =  12 * this.width + 'px'
  gridDiv.style.height =  12 * this.height + 'px'
  this.cells.forEach((row, x) => {
    row.forEach((cell, y) => {
      let elem = document.createElement('div')
      elem.className = 'cell ' + (cell ? 'alive' : 'dead')
      elem.addEventListener('mousedown', e => {
        if (!inMotion) {
          this.cells[x][y] = !this.cells[x][y]
          elem.className = 'cell ' + (this.cells[x][y] ? 'alive' : 'dead')
        }
      })
      gridDiv.appendChild(elem)
    })
  })
}

let life = new Grid(35, 35)

let timer
let speed = 500
let inMotion = false // so that we cannot change the state of the cell while the grid is changing

function draw() {
  life.toDOM()
}

function turnAndDrawEvery() {
  life.turn()
  life.toDOM()
  timer = setTimeout(turnAndDrawEvery, speed)
}

let startBtn = document.querySelector('#startBtn')
let stopBtn = document.querySelector('#stopBtn')
stopBtn.disabled = true
startBtn.addEventListener('click', e => {
  inMotion = true
  turnAndDrawEvery(speed)
  startBtn.disabled = true
  stopBtn.disabled = false
})
stopBtn.addEventListener('click', e => {
  inMotion = false
  clearTimeout(timer)
  startBtn.disabled = false
  stopBtn.disabled = true
})
document.querySelector('#clearBtn').addEventListener('click', e => {
  clearTimeout(timer)
  life.clear()
  life.toDOM()
  startBtn.disabled = false
  stopBtn.disabled = true
  inMotion = false
})
document.querySelector('#speedPlusBtn').addEventListener('click', e => {
  clearTimeout(timer)
  speed -= 50
  turnAndDrawEvery(speed)
})
document.querySelector('#speedMinusBtn').addEventListener('click', e => {
  clearTimeout(timer)
  speed += 50
  turnAndDrawEvery(speed)
})

draw()