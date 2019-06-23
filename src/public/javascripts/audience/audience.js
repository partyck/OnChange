let socket;
let questions;
let timerLimit = 100;

let actualQuestion;
let isQuestion;
let buttonsHeight;
let timer;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  socket = io.connect();
  isQuestion = false;
  questions = [
    {
      q: 'pregunta 1?\nlaskdlaskdlaksmd',
      a: ['respuesta 1', 'respuesta 2']
    },
    {
      q: 'pregunta 2?',
      a: ['respuesta 1', 'respuesta 2', 'respuesta 3']
    },
    {
      q: 'pregunta 3?',
      a: ['respuesta 1', 'respuesta 2', 'respuesta 3', 'respuesta 4']
    }
  ];

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
  buttonsHeight = headDistance * 2 / as.length;
  as.forEach((a, i) => {
    fill(100);
    stroke(255, 0, 0);
    strokeWeight(4);
    rect(0, headDistance + buttonsHeight * i, width, buttonsHeight);
    fill(255);
    noStroke();
    text(a, width / 2, headDistance + buttonsHeight * i + buttonsHeight / 2);
  });
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
      let option = round(distance / buttonsHeight);
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