let completeGame = false;

let instructions = "INSTRUCTIONS:   The  player  can  click  on  the  squares  in  the  grid  to change their color (one click for pink, two for gray).  The goal is to color the correct squares  following the clues  printed  on the left side  and top of the grid that correspond to the number of colored squares in sequence in each row/column."

//colors
let blank = 'white';
let filled = 'pink';
let ignored = 'dimgray';
let completeLine = 'gainsboro';
let words = 'black';

//board sizing
let size = 10;
let width = 30;
let offset = size * 10;
let topBorder = size * 5
let sideBorder = size * 10

//data storage
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
      puzzle[i][j] = (Math.random() > 0.35);
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

function setup() {
  createCanvas(60 * size, 80 * size);
  grid = newGrid();
  puzzle = newPuzzle();

  for (let i = 0; i < size; i++) {
    rowStatus[i] = blank;
    colStatus[i] = blank;
  }

  //create number clues
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

  //create 'number clue' strings for row & col
  for (let i = 0; i < size; i++) {
    horizontalHeadings[i] = horizontalValues[i].join("\n");
    verticalHeadings[i] = verticalValues[i].join(" ");
  }

}

function draw() {
  background(220);

  //reset button
  fill(filled);
  rect(sideBorder + offset / 3 - 4, topBorder + offset / 4 - 4, width + 8, width + 8);
  fill(blank);
  rect(sideBorder + offset / 3, topBorder + offset / 4, width, width);
  fill(words);
  textAlign(CENTER);
  text("RESET PUZZLE", sideBorder, topBorder + 3 * offset / 4, offset, width);
  textAlign(LEFT);

  //grid headers (with number clues)
  for (let i = 0; i < size; i++) {
    fill(rowStatus[i]);
    rect(i * width + offset + sideBorder, topBorder, width, offset);
    fill(colStatus[i]);
    rect(sideBorder, i * width + offset + topBorder, offset, width);

    fill(words);
    text(horizontalHeadings[i], i * width + offset + sideBorder + 10, topBorder + 10, width, offset);
    text(verticalHeadings[i], sideBorder + 10, i * width + offset + topBorder + 10, offset, width);
  }

  //grid
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let c = grid[i][j];
      if (c === "b") fill(blank);
      if (c === "f") fill(filled);
      if (c === "i") fill(ignored);
      rect(i * width + offset + sideBorder, j * width + offset + topBorder, width);
    }
  }

  //color guide at bottom
  fill(filled);
  rect(offset + sideBorder, size * width + offset + width + topBorder, width, width);
  fill(words);
  text("MARK FILLED", offset + width + sideBorder + 5, size * width + offset + width + topBorder + 10, (size - 2) / 2 * width, width);

  fill(ignored);
  rect(size * width / 2 + offset + sideBorder, (size + 1) * width + offset + topBorder, width, width);
  fill(words);
  text("MARK EMPTY", size * width / 2 + offset + width + 5 + sideBorder, (size + 1) * width + offset + 10 + topBorder, (size - 2) / 2 * width, width);

  // complete game modal
  if (completeGame) {
    fill('rgba(105, 105, 105, 0.5)');
    rect(sideBorder, topBorder, size * width + offset, size * width + offset);
    fill(blank);
    rect(30 * size - 60, 25 * size - 60, 22 * size, 16 * size);
    fill(words);
    textAlign(CENTER);
    text("CONGRATULATIONS\nPUZZLE COMPLETE", 30 * size - 60, 25 * size - 30, 22 * size, 16 * size);

    fill(filled);
    rect(30 * size + 30, 25 * size + 11, width + 8, width + 8);
    fill(blank);
    rect(30 * size + 34, 25 * size + 15, width, width);
    fill(words);
    text("PLAY AGAIN", 30 * size - 60, 25 * size + 60, 22 * size, 16 * size);
    textAlign(LEFT);
  }

  fill(words);
  text(instructions, sideBorder, topBorder + offset + size * width + 100, 60 * size - sideBorder * 2, 10 * size);

}

function isIn(i, j, mX, mY) {
  let x = i * width + offset + sideBorder;
  let y = j * width + offset + topBorder;
  return (mX > x && mX < x + width && mY > y && mY < y + width);
}

//check if any rows or columns are complete
function checkLines() {
  for (let i = 0; i < size; i++) {

    let horizontalSubStr = "";
    let verticalSubStr = ""

    //turn grid into strings for each row
    for (let j = 0; j < size; j++) {
      horizontalSubStr += grid[i][j];
      verticalSubStr += grid[j][i];
    }

    //build regular expressions
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

    //update row/col status (based on completed rows/columns)
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
  //when puzzle is complete, the only buttons that can be pressed are "Play Aagain"
  if (completeGame) {
    let x = 30 * size + 30;
    let y = 25 * size + 11;
    if (mouseX > x && mouseX < x + width + 8 && mouseY > y && mouseY < y + width + 8) {
      completeGame = false;
      setup();
    }
    return;
  }

  //Checks if player pressed "Reset"
  let x = sideBorder + offset / 3 - 4;
  let y = topBorder + offset / 4 - 4;
  if (mouseX > x && mouseX < x + width + 8 && mouseY > y && mouseY < y + width + 8) {
    grid = newGrid();
    checkLines();
    return;
  }

  //Checks if player pressed any of the grid squares
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
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