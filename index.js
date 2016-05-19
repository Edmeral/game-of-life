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

Grid.prototype.isInside = function (x, y) {
  return x < this.width && x >= 0 && y < this.height && y >= 0
}

// returns the state of the cell after one step
Grid.prototype.act = function (x, y) {
  let neighborsCoords = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
  let neighbors = neighborsCoords.map(coord => {
    let newX = x + coord[0], newY = y + coord[1]
    if (this.isInside(newX, newY)) 
      return this.cells[newX][newY]
    return false
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

// let life = new Grid(3, 3)
// life.makeAlive(0, 1)
// life.makeAlive(1, 1)
// life.makeAlive(2, 1)
// console.log(life.toString())
// life.turn()
// console.log(life.toString())

let life = new Grid(45, 45)
// life.makeAlive(0, 0)
// life.makeAlive(0, 1)
// life.makeAlive(1, 0)
// life.makeAlive(2, 3)
// life.makeAlive(3, 2)
// life.makeAlive(3, 3)
// life.turn()
// life.turn()

let timer
let speed = 500
let inMotion = false // so that we cannot change the state of the cell while the grid is changing

function draw() {
  life.toDOM()
}

function turnAdnDraw() {
  life.turn()
  life.toDOM()
  timer = setTimeout(turnAdnDraw, speed)
}

function repeatEvery(duration) {
  timer = setTimeout(turnAdnDraw, duration)
}

let startBtn = document.querySelector('#startBtn')
let stopBtn = document.querySelector('#stopBtn')
stopBtn.disabled = true
startBtn.addEventListener('click', e => {
  inMotion = true
  repeatEvery(speed)
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
  repeatEvery(speed)
})
document.querySelector('#speedMinusBtn').addEventListener('click', e => {
  clearTimeout(timer)
  speed += 50
  repeatEvery(speed)
})

draw()





