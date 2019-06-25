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

let consoleSimulator;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont('Courier New');
  socketListen();

  consoleSimulator = new ConsoleSimulator();
  scene = 0;
  timer = 0;
  letterDistancesY = 100;
  red = 0;
  green = 0;
  blue = 0;
}

function draw() {
  switch (scene) {
    case 0:
      background(0);
      break;
    case 1:
      background(red, green, blue);
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
    case 4:
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
      // asignValue();
      background(red, green, blue);
      // consoleSimulator.print();
      break;
    default:
      background(red, green, blue);
      consoleSimulator.print();
      break;
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

function socketListen() {
  socket.on('synth', data => {
    asignValue(data);
  });
  socket.on('scene', data => {
    scene = data.scene;
    if (scene == 2) {
      background(0);
    }
  });
  socket.on("question", data => {
    letterDistancesX = 60;
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