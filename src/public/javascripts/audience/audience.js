let socket;
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
let timerLimit = 1000;

let actualQuestion;
let isQuestion;
let buttonsHeight;
let timer;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  socket = io.connect();
  isQuestion = false;
  // TEXT SETTING
  textFont('Courier New');
  textAlign(CENTER, CENTER);
  textSize(30);

  listenSockets();
  background(0);
}

function draw() {
  background(0);
  if (isQuestion) {
    printQuestion();
    printOptions();
    printTimer();
    timer--;
  }
  if (timer < 0) {
    isQuestion = false;
  }
}

function printQuestion() {
  let q = questions[actualQuestion].q;
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text(q, width / 2, height / 3 / 2);
}

function printOptions() {
  let as = questions[actualQuestion].a;
  let headDistance = height / 3;
  buttonsHeight = headDistance * 2 / 2;
  fill(204, 255, 51);
  stroke(100);
  strokeWeight(10);
  rect(10, headDistance + buttonsHeight * 0, width - 15, buttonsHeight);
  fill(255, 102, 153);
  rect(10, headDistance + buttonsHeight * 1, width - 15, buttonsHeight);
  fill(0);
  noStroke();
  textStyle(BOLD);
  text(as[0], width / 2, headDistance + buttonsHeight * 0 + buttonsHeight / 2);
  text(as[1], width / 2, headDistance + buttonsHeight * 1 + buttonsHeight / 2);
}

function printTimer() {
  let length = map(timer, 0, timerLimit, 0, width);
  fill(0, 255, 0);
  noStroke();
  rect(0, 0, length, 10)
}

function listenSockets() {
  socket.on('question', data => {
    actualQuestion = data.index;
    isQuestion = true;
    timer = timerLimit;
  });
}

function touchEnded() {
  if (isQuestion) {
    if (mouseY > height / 3) {
      let distance = mouseY - height / 3;
      let option = Math.floor(distance / buttonsHeight)
      sendAnswer(option);
    }
  }
}
function sendAnswer(index) {
  socket.emit('audienceAnswer', {
    a: index
  });
  isQuestion = false;
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}