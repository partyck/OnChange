// let colorB = 255;
let socket = io.connect();
let timerLimit = 1000;
let questions = [
  {
    q: 'para continuar presiona el botón verde',
    a: [' ']
  },
  {
    q: '		     Idioma:',
    a: ['Pytoñol', 'Javanis']
  },
  {
    q: '		     Indumentaria:',
    a: [' ', ' ']
  },
  {
    q: '		     Peinado:',
    a: ['Cola', 'Suelto']
  }
];
let quotes = [
  '… conectando a OnwChange',
  'Bienvenido a ThusLab el ecosistema de Alba44',
  '    Alba44:',
  '		     Edad: 15239tps',
  '		     Estatura: 1,74 metros',
  '		     Armamento: no',
  '		     Version: beta1'
];

let red;
let green;
let blue;

let scene;
let vote;
let timer;
let quote;
let content;
let letterDistancesX;
let letterDistancesY;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont('Courier New');
  socketListen();

  red = 0;
  green = 0;
  blue = 0;
  scene = 0;
  timer = 0;
  letterDistancesY = 100;
  // background(0);
}

function draw() {
  switch (scene) {
    case 0:
      background(0);
      break;
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
      if (content) {
        let letter = content.shift();
        if (letter) {
          letterDistancesX += 15;
          printText(letter);
        }
        if (vote !== undefined) {
          vote.printVote(letterDistancesY);
          printTimer();
          timer--;
          if (timer < 0) {
            let result = " " + vote.result;
            content = content.concat(result.split(""));
            vote = undefined;
          }
        }
      }
      break;
    case 3:
      background(red);
      break;
    case 4:
      background(0, 0, 255);
      break;
    default:
      break;
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function socketListen() {
  socket.on('synth', data => {
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
    if (scene == 3) {
      red = map(data.value, 0, 360, 0, 255);
    }
  });
  socket.on("scene", data => {
    console.log(`scene: ${data.scene}`);
    background(0);
    scene = data.scene;
  });
  socket.on("question", data => {
    // background(0);
    letterDistancesX = 30;
    letterDistancesY += 30;
    content = questions[data.index].q.split("");
    vote = new Vote(questions[data.index].a, letterDistancesY);
    timer = timerLimit;

  });
  socket.on('audienceAnswer', data => {
    if (content) {
      vote.push(data.a);
    }
  });
  socket.on('text', data => {
    letterDistancesX = 60;
    letterDistancesY += 30;
    content = quotes[data.index].split("");
  });
}

function printTimer() {
  fill(0);
  noStroke();
  rect(0, 0, width, 10);
  let length = map(timer, 0, timerLimit, 0, width);
  fill(0, 0, 255);
  rect(0, 0, length, 10);
}

function printText(content) {
  fill(255);
  noStroke();
  textSize(20);
  text(content, letterDistancesX, letterDistancesY);
}