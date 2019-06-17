var attackLevel = 1;
var releaseLevel = 0;

var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 1;
var releaseTime = 0.5;

let osc, env;
let playing = false;
let playButton;
let logic;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  logic = new Logic();
  logic.listenAcc();
  logic.socket.on('sound',data => {
    if(data.session === logic.session){
      toggle();  
    }
  });
  // console.log(logic.alpha);
  playButton = createButton("play");
  playButton.position(0, height - 100);
  playButton.size(width , 50);
  playButton.mousePressed(toggle);
  playButton.addClass("btn btn-secondary btn-lg btn-block");

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
  if (playing) {
    logic.sendData();
    background(0, 255, 0);
  }

  textSize(50);
  fill(100);
  let kickLabel = 'A: ' + logic.alpha;
  text(kickLabel, 20, 100);
  kickLabel = 'B: ' + logic.beta;
  text(kickLabel, 20, 160);
  kickLabel = 'G: ' + logic.gamma;
  text(kickLabel, 20, 220);

  // let freq = map(logic.accX, -10, 10, 40, 880);
  let freq = map(abs(logic.alpha), 0, 360, 40, 1000);
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


