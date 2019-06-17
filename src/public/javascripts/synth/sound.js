var attackLevel = 1;
var releaseLevel = 0;

var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 0.4;
var releaseTime = 0.5;

const numOsc = 3;

let osca, enva;
let playing = false;
let socket = io.connect();
let xrect, yrect, zrect;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  strokeWeight(4);
  stroke(0, 255, 0);
  line(0, height / 2, width, height / 2);

  env = new p5.Envelope();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);

  osca = new Array();
  enva = new Array();
  for (var index = 0; index < numOsc; index++) {
    let osc = new p5.Oscillator();
    osc.setType('sine');

    let env = new p5.Envelope();
    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
    env.setRange(attackLevel, releaseLevel);
    osc.start();
    osc.amp(env);
    osca.push(osc);
    enva.push(env);
  }
  userStartAudio().then(function () {

  });
}

socket.on('attack', data => {
  let env = enva[data.session];
  console.log(enva);
  env.triggerAttack();
  playing = true;
});

socket.on('release', data => {
  let env = enva[data.session];
  env.triggerRelease();
  playing = false;
});

socket.on('synth', data => {
  let freq = map(abs(data.alpha), 0, 360, 40, 1000);
  // let freq = map(data.beta, -180, 180, 2110, 800);
  let osc = osca[data.session];
  xrect = map(data.alpha, 0, 360, 0, height/2);
  yrect = map(data.beta, -180, 180, -(height / 2), height / 2);
  zrect = map(data.gamma, -90, 90,-(height / 2), height / 2);
  console.log(osca);
  osc.freq(freq);
});

function draw() {
  background(0);
  strokeWeight(4);
  stroke(0, 255, 0);
  line(0, height / 2, width, height / 2);
  if (playing) {
    noStroke();
    fill(100);
    rect(0, height / 2, width / 3, -xrect);
    rect(width / 3, height / 2, width / 3, -yrect);
    rect(width / 3 * 2, height / 2, width / 3, -zrect);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function keyPressed() {
  
  if (key > 0 && key < 10) {
    console.log({key});
    socket.emit('sound', {
      session: key,
      index: 0
    });
  }
}