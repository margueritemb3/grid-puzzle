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
let horizontalHeadings = [];
let verticalHeadings = [];
let horizontalValues = [];
let verticalValues = [];
let rowStatus = [];
let colStatus = [];

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
      grid[i][j] = "b";
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
    rowStatus[i] = blank;
    colStatus[i] = blank;
  }

  for (let i = 0; i < size; i++) {
    horizontalValues[i] = [0];
    verticalValues[i] = [0];
    let hcount = 0;
    let vcount = 0;
    for (let j = 0; j < size; j++) {
      if (puzzle[i][j]) {
        hcount++;
      } else if (hcount !== 0) {
        horizontalValues[i].push(hcount);
        hcount = 0;
      }
      if (puzzle[j][i]) {
        vcount++;
      } else if (vcount !== 0) {
        verticalValues[i].push(vcount);
        vcount = 0;
      }
    }
    if (hcount !== 0) {
      horizontalValues[i].push(hcount);
    }
    if (vcount !== 0) {
      verticalValues[i].push(vcount);
    }
    if (horizontalValues[i].length > 1) {
      horizontalValues[i].shift();
    }
    if (verticalValues[i].length > 1) {
      verticalValues[i].shift();
    }
  }
  for (let i = 0; i < size; i++) {
    horizontalHeadings[i] = horizontalValues[i].join("\n");
    verticalHeadings[i] = verticalValues[i].join(" ");
  }

}



function draw() {
  background(220);

  if (completeGame) {
    console.log("PUZZLE COMPLETE!");

  }
  //rect(0, 0, offset);

  for (let i = 0; i < size; i++) {
    fill(rowStatus[i]);
    rect(i * width + offset, 0, width, offset);
    fill(colStatus[i]);
    rect(0, i * width + offset, offset, width);

    fill(words);
    text(horizontalHeadings[i], i * width + offset + 10, 10, width, offset);
    text(verticalHeadings[i], 10, i * width + offset + 10, offset, width);
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let c = grid[i][j];
      if (c === "b") fill(blank);
      if (c === "f") fill(filled);
      if (c === "i") fill(ignored);
      rect(i * width + offset, j * width + offset, width);
    }
  }
}

function checkLines() {
  for (let i = 0; i < size; i++) {

    let horizontalSubStr = "";
    let verticalSubStr = ""

    //turn grid into strings for each row
    for (let j = 0; j < size; j++) {
      horizontalSubStr += grid[i][j];
      verticalSubStr += grid[j][i];
    }

    //make regex
    let horizontalRegEx = "^(b|i)*"
    let verticalRegEx = "^(b|i)*";

    for (let j = 0; j < horizontalValues[i].length - 1; j++) {
      horizontalRegEx += "f{" + horizontalValues[i][j] + "}(b|i)+";
    }

    for (let j = 0; j < verticalValues[i].length - 1; j++) {
      verticalRegEx += "f{" + verticalValues[i][j] + "}(b|i)+";
    }

    horizontalRegEx = new RegExp(horizontalRegEx + "f{" + horizontalValues[i][horizontalValues[i].length - 1] + "}(b|i)*$");
    verticalRegEx = new RegExp(verticalRegEx + "f{" + verticalValues[i][verticalValues[i].length - 1] + "}(b|i)*$");

    if (horizontalRegEx.test(horizontalSubStr)) {
      rowStatus[i] = completeLine;
    } else {
      rowStatus[i] = blank;
    }

    if (verticalRegEx.test(verticalSubStr)) {
      colStatus[i] = completeLine;
    } else {
      colStatus[i] = blank;
    }
  }
}

function checkWin() {
  for (let i = 0; i < size; i++) {
    if (rowStatus[i] == blank || colStatus[i] == blank) {
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
        if (grid[i][j] === "b") {
          grid[i][j] = "f";
        } else if (grid[i][j] === "f") {
          grid[i][j] = "i";
        } else if (grid[i][j] === "i") {
          grid[i][j] = "b";
        }
        checkLines();
        checkWin();
        return;
      }
    }
  }
}