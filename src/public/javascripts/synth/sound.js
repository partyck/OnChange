var attackLevel = 1;
var releaseLevel = 0;

var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 0.4;
var releaseTime = 0.5;

let osc, osc2, env;
let playing = false;
let playButton;
let socket = io.connect();

let slider1, slider2;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  env = new p5.Envelope();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);

  osc = new p5.Oscillator();
  osc.setType('sine');
  osc2 = new p5.Oscillator();
  osc2.setType('triangle');

  slider1 = createSlider(40, 1300, 440);
  slider2 = createSlider(40, 1300, 440);

  userStartAudio().then(function () {
    osc.start();
    osc.amp(env);
    osc2.start();
    osc2.amp(env);
  });
}

socket.on('attack', data => {
  // console.log('attack', data);
  env.triggerAttack();
  // env2.triggerAttack();
  playing = true;
});

socket.on('release', data => {
  // console.log('release', data);
  env.triggerRelease();
  // env2.triggerRelease();
  playing = false;
});

socket.on('synth', data => {
  if (data.session == 1) {
    // console.log({data});
    freq = map(data.y, -10, 10, 40, 880);
    osc.freq(freq);
  } else {
    // console.log({data});
    freq = map(data.x, -10, 10, 40, 880);
    osc2.freq(freq);
  }
});

function draw() {
  background(0);
  if (playing) {
    debugger;
    background(0, 255, 0);
  }
  // osc.freq(slider1.value());
  // osc2.freq(slider2.value());
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}