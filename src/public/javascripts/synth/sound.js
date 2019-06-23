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
let xrect, yrect, zrect;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  strokeWeight(4);
  stroke(0, 255, 0);
  line(0, height / 2, width, height / 2);
  typeOsc = ['sine', 'square', 'sawtooth'];

  // env = new p5.Envelope();
  // env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  // env.setRange(attackLevel, releaseLevel);

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
  let env = enva[data.session - 1];
  // debugger;
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
  if (data.key === 'alpha') {
    freq = map(abs(data.value), 0, 360, 40, 1000);
  }
  if (data.key === 'beta') {
    freq = map(abs(data.value), 0, 180, 40, 1000);
  }
  if (data.key === 'gamma') {
    freq = map(abs(data.value), 0, 90, 40, 1000);
  }
  let osc = osca[data.session - 1];
  osc.freq(freq);
  switch (data.session) {
    case 1:
      xrect = map(data.value, 0, 360, 0, height / 2);
      break;
    case 2:
      yrect = map(data.value, -180, 180, -(height / 2), height / 2);
      break;
    case 3:
      zrect = map(data.value, -90, 90, -(height / 2), height / 2);
      break;
    default:
      break;
  }
});


// socket.on('oscFrec', data => {
//   let osc = osca[data.session - 1];
//   let freq = map(abs(data.alpha), 0, 360, 40, 1000);
//   xrect = map(data.alpha, 0, 360, 0, height / 2);
//   yrect = map(data.beta, -180, 180, -(height / 2), height / 2);
//   zrect = map(data.gamma, -90, 90, -(height / 2), height / 2);

//   osc.freq(freq);
// });


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
    console.log({ key });
    socket.emit('sound', {
      session: key,
      index: 1
    });
  }
}

function sendQ(i){
  console.log("send");
  socket.emit('question',{
    index: i
  });
} 

function changeScene(i){
  console.log(`scene: ${i}`);
  socket.emit('scene',{
    scene: i
  });
} 