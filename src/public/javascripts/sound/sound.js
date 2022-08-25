var attackLevel = 1;
var releaseLevel = 0;

var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 0.4;
var releaseTime = 0.5;

const numOsc = 3;

const typeOsc= ['sine', 'square', 'sawtooth'];

let osca, enva;
let playing = false;
let socket = io.connect();

let scene = parseInt(document.getElementById("scene").textContent);
const order = ['t', 'q', 't', 't', 't', 't', 'q', 't', 'q', 't', 'q', 't'];
let scene4order = 4;
let textCounter = 0;
let questionCounter = 0;
let mute = true;
let permissionButton;

let fft;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  strokeWeight(4);
  stroke(0, 255, 0);
  line(0, height / 2, width, height / 2);

  fft = new p5.FFT(0, 256);


  osca = new Array();
  enva = new Array();
  for (var index = 0; index < numOsc; index++) {
    let osc = new p5.Oscillator();
    osc.setType(typeOsc[0]);
    let env = new p5.Envelope();
    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
    env.setRange(attackLevel, releaseLevel);
    // osc.start();
    osc.amp(env);
    osca.push(osc);
    enva.push(env);
  }
  listenSockets();
  permissionButton = createButton('Activar audio');
  permissionButton.position(100, 100);
  permissionButton.mousePressed(permission);
}

function listenSockets() {
  socket.on('attack', data => {
    let env = enva[data.session];
    let osc = osca[data.session];
    osc.start();
    if (scene == 1 || scene == 2) {
      osc.setType(typeOsc[0]);
    } else {
      osc.setType(typeOsc[1]);
    }
    env.triggerAttack();
    playing = true;
  });

  socket.on('release', data => {
    let env = enva[data.session];
    env.triggerRelease();
    playing = false;
  });

  socket.on('synth', data => {
    let frequency = 0;
    switch (scene) {
      case 1:
        frequency = map(abs(data.alpha - 90), 0, 90, 40, 1000);
        break;
      case 2:
        frequency = map(abs(data.beta - 90), 0, 90, 40, 1000);
        break;
      default:
        frequency = map(abs(data.alpha), 0, 360, 40, 1000);
        break;
    }
    let osc = osca[data.session];
    osc.freq(frequency);
  });
  socket.on('scene', data => {
    scene = data.scene;
  });
}

function draw() {
  background(0);
  strokeWeight(10);
  stroke(0, 255, 0);
  noFill();
  if (playing) {
    let waveform = fft.waveform();
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y = map(waveform[i], -1, 1, height, 0);
      vertex(x, y);
    }
    endShape();

  } else {
    line(0, height / 2, width, height / 2);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function permission() {
  if (mute) {
    mute = false;
    permissionButton.hide()
  }
}