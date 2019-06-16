let font, fontSize = 30;
let logic;

function preload() {
  font = loadFont('assets/BebasNeue-Regular.ttf');
}

function setup() {
  logic = new Logic();
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  rectMode(CENTER);
  textFont(font);
  textSize(fontSize);
}

function draw() {
  // if (mouseIsPressed) {
    logic.listenAcc();
    logic.sendData();
  // }
  printBackground();
  printLabel();
}

function printBackground() {
  var red = map(-logic.accX, -9.81, 9.81, 0, 255);
  var green = map(-logic.accY, -9.81, 9.81, 0, 255);
  var blue = map(-logic.accZ, -9.81, 9.81, 0, 255);
  background(red, green, blue);
}

function printLabel() {
  textSize(100);
  let knobLabel = 'KNOB';
  text(knobLabel, 20, 100);

  textSize(fontSize);
  let sessionLabel = 'SESSION:    ' + logic.session;
  text(sessionLabel, 20, 140);
  let accLabel = 'Acelerometer:    ' + logic.accSuport;
  text(accLabel, 20, 180);

  let coorx = 'alpha: ' + logic.alpha;
  text(coorx, 20, 220);
  let coory = 'beta: ' + logic.beta;
  text(coory, 20, 260);
  let coorz = 'gamma: ' + logic.gamma;
  text(coorz, 20, 300);
}


function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

