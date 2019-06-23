let colorB = 255;
let socket = io.connect();

let red;
let green;
let blue;

let scene;

let consoleSimulator;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont('Courier New');
  consoleSimulator = new ConsoleSimulator();
  scene = 0;
  red = 0;
  green = 0;
  blue = 0;
  socket.on('synth', data => { asignValue(data); });
  socket.on('scene', data => { scene = data.scene; });
}

function draw() {
  background(red, green, blue);
  consoleSimulator.print();
}

function addTexts() {
  for (let index = 0; index < 50; index++) {
    let ejemplo2 = "hola " + index;
    consoleSimulator.addString(ejemplo2);
  }
}


function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function asignValue(data) {
  consoleSimulator.addObj(data);
  if (scene == 1) {
    switch (data.session) {
      case '1':
        red = map(abs(data.value - 90), 0, 50, 0, 255);
        break;
      case '2':
        green = map(abs(data.value - 90), 0, 50, 0, 255);
        break;
      case '3':
        blue = map(abs(data.value - 90), 0, 50, 0, 255);
        break;
      default:
        break;
    }
  }
  if (scene == 2) {
    red = 0;
    green = 0;
    blue = 0;
  }
  if (scene == 3) {
    let grey = map(data.value, 0, 360, 0, 255);
    red = grey;
    green = grey;
    blue = grey;
  }
  if (scene == 4) {
    red = 0;
    green = 0;
    blue = 255;
  }
}