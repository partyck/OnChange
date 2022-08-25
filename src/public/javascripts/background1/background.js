// let colorB = 255;
let socket = io.connect();
let timerLimit = 1000;
let questions = [
  {
    q: ' Elige tu aventura:',
    a: ['Into the void', 'Stranger Strings']
  },
  {
    q: '		     Idioma:',
    a: ['Pytoñol', 'Javanis']
  },
  {
    q: '		     Indumentaria:',
    a: ['Verde', 'Fucsia']
  },
  {
    q: '		     Estilo de cabello:',
    a: ['Cola', 'Suelto']
  },
  {
    q: 'HIDRATACIÓN',
    a: ['SI', 'NO']
  },
  {
    q: 'BOTELLA',
    a: ['VERDE', 'FUCSIA']
  },
  {
    q: 'VOZ',
    a: ['SI', 'NO']
  },
  {
    q: 'CAMBIAR PATRON',
    a: ['SI', 'NO']
  },
  {
    q: 'VIOLENCIA',
    a: ['SI', 'NO']
  },
  {
    q: 'FINAL',
    a: ['SI', 'NO']
  }
];
let quotes = [
  ' . . . conectando a OnChange()',
  '	Bienvenido, esta aventura se desarrolla en',
  ' Cassel, el entorno controlado de Haxan03',
  '     Haxan03:',
  '		     Edad: 67483316ttl',
  '		     Estatura: 68,5 pulgadas',
  '		     Armas: No disponibles en esta aventura',
  '		     Version: beta1'
];

let red;
let green;
let blue;

let scene;
let vote;
let timer;
let isFinale;
let isFinaleSent;
let initColor;
let initColorF;

let quote;
let content;
let actualQuestion;
let letterDistancesX;
let letterDistancesY;

let consoleSimulator;

let smatphoneBlack;

function preload() {
  smatphoneBlack = loadImage('/assets/handSmartphoneBlack.png');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont('Courier New');
  socketListen();

  consoleSimulator = new ConsoleSimulator();
  scene = parseInt(document.getElementById("scene").textContent);
  timer = 0;
  letterDistancesY = 100;
  red = 0;
  green = 0;
  blue = 0;
  isFinale = false;
  isFinaleSent = false;
  initColor = 255;
  initColorF = true;
}

function draw() {
  switch (scene) {
    case 0:
      background(initColor);
      if (initColorF) {
        if (initColor < 210) {
          initColorF = false;
        } else {
          initColor = initColor - 0.5;
        }
      } else {
        if (initColor > 255) {
          initColorF = true;
        } else {
          initColor = initColor + 0.6;
        }
      }
      break;
    case 1:
      background(red, green, blue);
      break;
    case 2:
      if (content) {
        let letter = content.shift();
        if (letter) {
          letterDistancesX += 19;
          printText(letter);
        }
        if (vote !== undefined) {
          sendVotation();
          vote.printVote(letterDistancesY);
          printTimer();
          printSPIcon();
          timer--;
          if (timer < 0) {
            let result = " " + vote.result;
            vote.coverVote();
            coverSPI(color(0));
            content = content.concat(result.split(""));
            vote = undefined;
          }
        }
      }
      break;
    case 3:
      background(red, green, blue);
      consoleSimulator.print();
    case 4:
      if (!isFinale) {
        background(red, green, blue);
        consoleSimulator.print();
        if (content) {
          let letter = content.shift();
          if (letter) {
            quote = quote + letter;
          }
          printText(quote);
          if (vote !== undefined) {
            vote.printVote(letterDistancesY);
            printTimer();
            printSPIcon();
            timer--;
            if (timer < 0) {
              isFinale = vote.finale;
              // isFinaleSent = isFinale;
              let result = " " + vote.getResult();
              content = content.concat(result.split(""));
              vote = undefined;
            }
          }
        }
      } else {
        if (!isFinaleSent) {
          sendFinale();
          isFinaleSent = true
        }
        printNos();
      }
      break;
    case 5:
      background(10);
      break;
    default:
      // background(red, green, blue);
      // consoleSimulator.print();
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
        red = map(abs(data.alpha - 90), 0, 50, 0, 255);
        break;
      case '2':
        green = map(abs(data.alpha - 90), 0, 50, 0, 255);
        break;
      case '3':
        blue = map(abs(data.alpha - 90), 0, 50, 0, 255);
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
    let grey = map(data.alpha, 0, 360, 0, 255);
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
    consoleSimulator.addObj(data);
    scene = data.scene;
    if (scene == 2) {
      background(0);
    }
    if (scene == 4) {
      letterDistancesY = 100;
      content = undefined;
    }
  });
  socket.on("question", data => {
    consoleSimulator.addObj(data);
    if (scene == 4) {
      letterDistancesX = width / 2;
      quote = '';
    } else {
      letterDistancesX = 60;
    }
    letterDistancesY += 35;
    actualQuestion = data.index;
    content = questions[data.index].q.split("");
    vote = new Vote(questions[data.index].a, letterDistancesY, scene);
    if (data.index == 9) {
      vote.isFinale();
    }
    timer = timerLimit;
  });
  socket.on('audienceAnswer', data => {
    consoleSimulator.addObj(data);
    if (content) {
      vote.push(data.a);
    }
  });
  socket.on('text', data => {
    consoleSimulator.addObj(data);
    letterDistancesX = 60;
    letterDistancesY += 35;
    content = quotes[data.index].split("");
  });
}

function printTimer() {
  let b, c;
  if (scene == 2) {
    b = color(0);
    c = color(0, 0, 255);
  } else {
    b = color(0, 0, 255);
    c = color(255, 0, 0);
  }
  fill(b);
  noStroke();
  rect(0, 0, width, 10);
  let length = map(timer, 0, timerLimit, 0, width);
  fill(c);
  rect(0, 0, length, 10);
}

function printText(content) {
  if (scene == 2) {
    fill(255);
    noStroke();
    textSize(30);
  } else {
    fill(204, 255, 51);
    noStroke();
    textSize(40);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    let cWidth = textWidth(content);
    rect(letterDistancesX - cWidth / 2, letterDistancesY - 5, cWidth, 40);
    fill(0);
  }
  text(content, letterDistancesX, letterDistancesY);
}

function printNos() {
  frameRate(5);
  let xcor = width * random();
  let ycor = height * random();
  let scale = random(1, 10)
  fill(255, 0, 0);
  noStroke();
  textSize(30 * scale);
  let cWidth = textWidth('NO');
  let cHeigth = textAscent();
  rect(xcor - cWidth / 2, ycor - cHeigth / 2, cWidth, cHeigth);
  fill(0);
  noStroke();
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('NO', xcor, ycor);
}

function sendFinale() {
  socket.emit('finale', {});
}

function printSPIcon() {
  image(smatphoneBlack, width - 100, 60, 80, 80);
}

function coverSPI(color) {
  fill(color);
  noStroke();
  rect(width - 100, 60, 80, 80);
}

function sendVotation() {
  socket.emit('questionAudience', {
    index: actualQuestion
  });
}