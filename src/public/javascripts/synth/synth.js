var attackLevel = 1;
var releaseLevel = 0;

var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 1;
var releaseTime = 0.5;

let osc, env;
// let accX, accY, accZ;
let playing = false;
let playButton;
let logic;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  logic = new Logic();
  playButton = createButton("play");
  playButton.position(10, height - 50);
  playButton.size(200, 50)
  playButton.mousePressed(toggle);

  env = new p5.Envelope();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);

  osc = new p5.Oscillator();
  osc.setType('sine');

  userStartAudio().then(function () {
    osc.start();
    osc.amp(env);
  });
}

function draw() {
  background(0);
  logic.listenAcc();
  if (playing) {
    debugger;
    logic.sendData();
    background(0, 255, 0);
  }
  let freq = map(logic.accX, -10, 10, 40, 880);
  osc.freq(freq);
}

function toggle() {
  if (!playing) {
    env.triggerAttack();
    logic.sendTriggerAttack();
    playing = true;
  } else {
    env.triggerRelease();
    logic.sendtriggerRelease();
    playing = false;
  }
  // console.log(env);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}