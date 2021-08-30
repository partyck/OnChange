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
let order = ['t', 'q', 't', 't', 't', 't', 'q', 't', 'q', 't', 'q', 't'];
let scene4order = 4;
let textCounter = 0;
let questionCounter = 0;

let fft;

//sliders
let slider1, slider2, slier3;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  strokeWeight(4);
  stroke(0, 255, 0);
  line(0, height / 2, width, height / 2);
  typeOsc = ['sine', 'square', 'sawtooth'];

  fft = new p5.FFT(0, 256);

  //sliders
  slider1 = createSlider( 40, 1000, 300);
  slider1.position(100 , 20);
  slider1.style('width', '400px');
  slider2 = createSlider( 40, 1000, 300);
  slider2.position(100 , 40);
  slider2.style('width', '400px');
  slider3 = createSlider( 40, 1000, 300);
  slider3.position(100 , 60);
  slider3.style('width', '400px');

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
    let osc = osca[data.session - 1];
    if (scene == 1 || scene == 2) {
      osc.setType(typeOsc[0]);
    } else {
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
    } else {
      freq = map(abs(data.value), 0, 360, 40, 1000);
    }
    let osc = osca[data.session - 1];
    osc.freq(freq);
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

    //sliders
    osca[0].freq(slider1.value());
    osca[1].freq(slider2.value());
    osca[2].freq(slider3.value());

  } else {
    line(0, height / 2, width, height / 2);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

// function keyPressed() {
//   if (key > 0 && key < 10) {
//     // console.log({ key });
//     socket.emit('sound', {
//       session: key,
//       index: 1
//     });
//   }
// }

function sendQ(i) {
  // console.log("send");
  socket.emit('question', {
    index: i
  });
}

function sendText(i) {
  // console.log("send");
  socket.emit('text', {
    index: i
  });
}

function changeScene(i) {
  scene = i;
  // console.log(`scene: ${i}`);
  socket.emit('scene', {
    scene: scene
  });
}

function nextScene() {
  scene++;
  socket.emit('scene', {
    scene: scene
  });
  return scene;
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

function send4() {
  sendQ(scene4order);
  scene4order++;
}