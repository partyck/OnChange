var attackLevel = 1;
var releaseLevel = 0;

var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 0.4;
var releaseTime = 0.5;

const numOsc = 3;

let typeOsc;

let osca, enva;
let playing = false;
let socket = io.connect();

let scene = 0;
let order = ['t', 'q', 't', 't', 't', 'q', 't', 'q', 't', 'q', 't'];
let textCounter = 0;
let questionCounter = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  strokeWeight(4);
  stroke(0, 255, 0);
  line(0, height / 2, width, height / 2);

  typeOsc = ['sine', 'square', 'sawtooth'];

  osca = new Array();
  enva = new Array();
  for (var index = 0; index < numOsc; index++) {
    let osc = new p5.Oscillator();
    osc.setType(typeOsc[0]);
    let env = new p5.Envelope();
    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
    env.setRange(attackLevel, releaseLevel);
    osc.start();
    osc.amp(env);
    osca.push(osc);
    enva.push(env);
  }
  listenSockets();
  userStartAudio().then(() => { });
}

function listenSockets() {
  socket.on('attack', data => {
    let env = enva[data.session - 1];
    if (scene == 1 || scene == 2) {
      let osc = osca[data.session - 1];
      osc.setType(typeOsc[0]);
    }
    if (scene == 3 || scene == 4) {
      let osc = osca[data.session - 1];
      osc.setType(typeOsc[1]);
    }
    env.triggerAttack();
    playing = true;
  });

  socket.on('release', data => {
    let env = enva[data.session - 1];
    env.triggerRelease();
    playing = false;
  });

  socket.on('synth', data => {
    let freq = 0;
    if (scene == 1 || scene == 2) {
      freq = map(abs(data.value - 90), 0, 90, 40, 1000);
    }
    if (scene == 3 || scene == 4) {
      freq = map(abs(data.value), 0, 360, 40, 1000);
    }

    // if (data.key === 'alpha') {
    //   freq = map(abs(data.value), 0, 360, 40, 1000);
    // }
    // if (data.key === 'beta') {
    //   freq = map(abs(data.value), 0, 180, 40, 1000);
    // }
    // if (data.key === 'gamma') {
    //   freq = map(abs(data.value), 0, 90, 40, 1000);
    // }
    let osc = osca[data.session - 1];
    osc.freq(freq);
  });
}

function draw() {
  background(0);
  strokeWeight(4);
  stroke(0, 255, 0);
  line(0, height / 2, width, height / 2);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function keyPressed() {
  if (key > 0 && key < 10) {
    console.log({ key });
    socket.emit('sound', {
      session: key,
      index: 1
    });
  }
}

function sendQ(i) {
  console.log("send");
  socket.emit('question', {
    index: i
  });
}

function sendText(i) {
  console.log("send");
  socket.emit('text', {
    index: i
  });
}

function changeScene(i) {
  scene = i;
  console.log(`scene: ${i}`);
  socket.emit('scene', {
    scene: scene
  });
}

function nextScene() {
  scene++;
  socket.emit('scene', {
    scene: scene
  });
}

function sendTQ() {
  let option = order.shift();
  if (option == 't') {
    sendText(textCounter);
    textCounter++;
  } else {
    sendQ(questionCounter);
    questionCounter++;
  }
}