let font, fontSize = 30;
let logic;
let change;

function preload() {
  font = loadFont('assets/BebasNeue-Regular.ttf');
}

function setup() {
  pixelDensity(1);
  logic = new Logic();
  // change = map(1, 0, height, 0, 12);
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  rectMode(CENTER);
  textFont(font);
  textSize(fontSize);

}

function draw() {
  background(0);
  printLabel();
  if (mouseIsPressed) {
    logic.sendKeyUp();
    drawPoint();
  }
}

function drawPoint() {
  noStroke();
  fill(0, 255, 0);
  // square(winMouseX, winMouseY, 50);
  rect(0, winMouseY, width * 2, 100);
}

function mouseReleased() {
  logic.sendKeyDown();

}

function printLabel() {
  fill(0, 255, 0);
  textSize(90);
  let kickLabel = 'KEYBOARD';
  text(kickLabel, 20, 100);
  
  textSize(fontSize);
  let sess = 'SESSION: ' + logic.session;
  text(sess, 20, 140);
  let coorx = 'X: ' + mouseX;
  text(coorx, 20, 180);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

