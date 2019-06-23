let colorB = 255;
let socket = io.connect();

let red;
let green;
let blue;
let scene = 1;
let font;
let questions = [
  `pregunta 1?`,
  `pregunta 2?`,
  `pregunta 3?`
]
let points;
let question;
let distance;

function preload() {
  font = loadFont('assets/BebasNeue-Regular.ttf');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont('Courier New');
  socketListen();
  state = 0;
  red = 0;
  green = 0;
  blue = 0;
  background(0);
}

function draw() {
  switch (scene) {
    case 1:
      background(red, green, blue);
      noStroke();
      fill(green, 0, 0);
      let redDiam = map(red, 0, 255, 0, height);
      ellipse(width / 2, height / 2, redDiam, redDiam);

      fill(0, green - 255, 0);
      let greenDiam = map(green, 0, 255, 0, height);
      ellipse(width / 2, height / 2, greenDiam, greenDiam);

      fill(0, 0, blue - 255, 0.5);
      let blueDiam = map(blue, 0, 255, 0, height);
      ellipse(width / 2, height / 2, blueDiam, blueDiam);
      break;
    case 2:
      if (question) {
        let letter = question.shift();
        fill(255);
        noStroke();
        textSize(20);
        text(letter, distance, 100);
        distance += 15;
      }
      break;
    case 3:
      background(red);
      break;
    default:
      background(0)
      break;
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function socketListen() {
  socket.on('synth', data => {
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
  socket.on("scene", data => {
    console.log(`scene: ${data.scene}`);
    background(0);
    scene = data.scene;
  });
  socket.on("question", data => {
    background(0);
    distance = 30;
    question = questions[data.index].split("");
  });
}