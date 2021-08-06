let completeGame = false;

//colors:
let blank = 'white';
let filled = 'pink';
let ignored = 'dimgray';
let completeLine = 'gainsboro';
let words = 'black';

//board sizing
let size = 8;
let width = 30;
let offset = size * 10;

let grid;
let puzzle;
let hHeadings = [];
let vHeadings = [];
let rows = [];
let cols = [];

function newPuzzle() {
  let puzzle = [];
  for (let i = 0; i < size; i++) {
    puzzle[i] = [];
    for (let j = 0; j < size; j++) {
      puzzle[i][j] = (Math.random() > 0.4);
    }
  }
  return puzzle;
}

function newGrid() {
  let grid = [];
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      grid[i][j] = blank;
    }
  }
  return grid;
}

function isIn(i, j, mX, mY) {
  let x = i * width + offset;
  let y = j * width + offset;
  return (mX > x && mX < x + width && mY > y && mY < y + width);
}

function setup() {
  createCanvas(40 * size, 40 * size);
  grid = newGrid();
  puzzle = newPuzzle();

  console.log(puzzle);

  for (let i = 0; i < size; i++) {
    rows[i] = blank;
    cols[i] = blank;
  }


  let hcount = 0;
  let vcount = 0;
  for (let i = 0; i < size; i++) {
    hHeadings[i] = "";
    vHeadings[i] = "";
    for (let j = 0; j < size; j++) {
      if (puzzle[i][j]) {
        if (hcount === 0) hHeadings[i] += "\n";
        hcount++;
      }
      else if (!puzzle[i][j]) {
        if (hcount !== 0) hHeadings[i] += hcount;
        hcount = 0;
      }

      if (puzzle[j][i]) {
        if (vcount === 0) vHeadings[i] += " ";
        vcount++;
      }
      else if (!puzzle[j][i]) {
        if (vcount !== 0) vHeadings[i] += vcount;
        vcount = 0;
      }
    }
    if (hcount > 0) hHeadings[i] += hcount;
    if (vcount > 0) vHeadings[i] += vcount;

    if (hHeadings[i] === "") hHeadings[i] += "\n" + 0;
    if (vHeadings[i] === "") vHeadings[i] += " " + 0;

    hcount = 0;
    vcount = 0;

  }


}

function draw() {
  background(220);

  if (completeGame) {
    console.log("PUZZLE COMPLETE!");

  }
  //rect(0, 0, offset);

  for (let i = 0; i < size; i++) {
    fill(rows[i]);
    rect(i * width + offset, 0, width, offset);
    fill(cols[i]);
    rect(0, i * width + offset, offset, width);

    fill(words);
    text(hHeadings[i], i * width + offset + 10, 0, width, offset);
    text(vHeadings[i], 10, i * width + offset + 10, offset, width);
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      fill(grid[i][j]);
      rect(i * width + offset, j * width + offset, width);
    }
  }
}

function checkLines() {
  for (let i = 0; i < size; i++) {
    let row = true;
    let col = true;
    for (let j = 0; j < size; j++) {
      if ((grid[i][j] === filled && !puzzle[i][j]) || (grid[i][j] !== filled && puzzle[i][j])) {
        row = false;

      }
      if ((grid[j][i] === filled && !puzzle[j][i]) || (grid[j][i] !== filled && puzzle[j][i])) {
        col = false;
      }
    }
    if (row) {
      rows[i] = completeLine;
    } else {
      rows[i] = blank;
    }

    if (col) {
      cols[i] = completeLine;
    } else {
      cols[i] = blank;
    }
  }
}

function checkWin() {
  for (let i = 0; i < size; i++) {
    if (rows[i] == blank || cols[i] == blank) {
      return;
    }
  }
  completeGame = true;
}

function mousePressed() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let x = i * width + offset;
      let y = j * width + offset;
      if (isIn(i, j, mouseX, mouseY)) {
        if (grid[i][j] === blank) {
          grid[i][j] = filled;
        } else if (grid[i][j] === filled) {
          grid[i][j] = ignored;
        } else if (grid[i][j] === ignored) {
          grid[i][j] = blank;
        }
        checkLines();
        checkWin();
        return;
      }
    }
  }
}