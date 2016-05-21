'use strict';

function Grid(width, height) {
  this.width = width;
  this.height = height;
  this.cells = this.generateCells();
}

Grid.prototype.generateCells = function () {
  var cells = new Array(this.height);
  for (var i = 0; i < this.height; i++) {
    cells[i] = new Array(this.width);
    for (var j = 0; j < this.width; j++) {
      cells[i][j] = false;
    }
  }
  return cells;
};

Grid.prototype.clear = function () {
  this.cells = this.generateCells();
};

Grid.prototype.makeAlive = function (x, y) {
  this.cells[x][y] = true;
};

// Check if a given coordinate is within the grid
Grid.prototype.isInside = function (x, y) {
  return x < this.width && x >= 0 && y < this.height && y >= 0;
};

/* returns the state of the cell after one step
   Rules :
    1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    2. Any live cell with two or three live neighbours lives on to the next generation.
    3. Any live cell with more than three live neighbours dies, as if by over-population.
    4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
Grid.prototype.act = function (x, y) {
  var _this = this;

  var neighborsCoords = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  var neighbors = neighborsCoords.map(function (coord) {
    var newX = x + coord[0],
        newY = y + coord[1];
    if (_this.isInside(newX, newY)) return _this.cells[newX][newY];
    return false; // if a neighbor is not within the grid, it can be considered dead
  });

  // Calculating the number of live neighboring cells
  var liveNeighborsCount = neighbors.reduce(function (count, neighbor) {
    return count + (neighbor ? 1 : 0);
  }, 0);

  if (liveNeighborsCount < 2 || liveNeighborsCount > 3) return false;
  if (liveNeighborsCount == 3) return true;
  return this.cells[x][y];
};

// Generating the grid after one step
Grid.prototype.turn = function () {
  var newCells = this.generateCells();
  for (var x = 0; x < this.height; x++) {
    for (var y = 0; y < this.width; y++) {
      newCells[x][y] = this.act(x, y);
    }
  }
  this.cells = newCells;
};

Grid.prototype.toDOM = function () {
  var _this2 = this;

  var gridDiv = document.querySelector('#grid');
  gridDiv.innerHTML = "";
  gridDiv.style.width = 12 * this.width + 'px';
  gridDiv.style.height = 12 * this.height + 'px';
  this.cells.forEach(function (row, x) {
    row.forEach(function (cell, y) {
      var elem = document.createElement('div');
      elem.className = 'cell ' + (cell ? 'alive' : 'dead');
      elem.addEventListener('mousedown', function (e) {
        if (!inMotion) {
          _this2.cells[x][y] = !_this2.cells[x][y];
          elem.className = 'cell ' + (_this2.cells[x][y] ? 'alive' : 'dead');
        }
      });
      gridDiv.appendChild(elem);
    });
  });
};

var life = new Grid(35, 35);

var timer = void 0;
var speed = 500;
var inMotion = false; // so that we cannot change the state of the cell while the grid is changing

function draw() {
  life.toDOM();
}

function turnAndDrawEvery() {
  life.turn();
  life.toDOM();
  timer = setTimeout(turnAndDrawEvery, speed);
}

var startBtn = document.querySelector('#startBtn');
var stopBtn = document.querySelector('#stopBtn');
stopBtn.disabled = true;
startBtn.addEventListener('click', function (e) {
  inMotion = true;
  turnAndDrawEvery(speed);
  startBtn.disabled = true;
  stopBtn.disabled = false;
});
stopBtn.addEventListener('click', function (e) {
  inMotion = false;
  clearTimeout(timer);
  startBtn.disabled = false;
  stopBtn.disabled = true;
});
document.querySelector('#clearBtn').addEventListener('click', function (e) {
  clearTimeout(timer);
  life.clear();
  life.toDOM();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  inMotion = false;
});
document.querySelector('#speedPlusBtn').addEventListener('click', function (e) {
  clearTimeout(timer);
  speed -= 50;
  turnAndDrawEvery(speed);
});
document.querySelector('#speedMinusBtn').addEventListener('click', function (e) {
  clearTimeout(timer);
  speed += 50;
  turnAndDrawEvery(speed);
});

draw();

