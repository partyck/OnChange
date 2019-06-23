let colorB = 255;
let socket = io.connect();

let red;
let green;
let blue;

let state;

let consoleSimulator;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont('Courier New');
  consoleSimulator = new ConsoleSimulator();
  state = 0;
  red = 0;
  green = 0;
  blue = 0;
  socket.on('synth', data => {
    consoleSimulator.addObj(data);
    if (data.key === "beta") {
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
  });
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