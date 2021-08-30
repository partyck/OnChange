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
let quote;
let content;
let letterDistancesX;
let letterDistancesY;
let isFinale;
let isFinaleSent;
let initColor;
let initColorF;

let smatphoneBlack;

function preload() {
  smatphoneBlack = loadImage('/assets/handSmartphoneBlack.png');
}

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
  isFinale = false;
  isFinaleSent = false;
  initColor = 255;
  initColorF = true;
  // background(0);
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
          letterDistancesX += 19;
          printText(letter);
        }
        if (vote !== undefined) {
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
      background(red);
      break;
    case 4:
      if (!isFinale) {
        background(0, 0, 255);
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
              let result = " " + vote.result;
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
    if (scene == 4) {
      letterDistancesX = width / 2;
      quote = '';
    } else {
      letterDistancesX = 60;
    }
    letterDistancesY += 35;
    content = questions[data.index].q.split("");
    vote = new Vote(questions[data.index].a, letterDistancesY, scene);
    if (data.index == 9) {
      vote.isFinale();
    }
    timer = timerLimit;
  });
  socket.on('audienceAnswer', data => {
    if (content) {
      vote.push(data.a);
    }
  });
  socket.on('text', data => {
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