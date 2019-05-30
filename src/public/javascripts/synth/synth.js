let osc, fft;
let accX, accY, accZ;
let playing = false;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  osc = new p5.Oscillator();
  osc.amp(0);
  fft = new p5.FFT();
  userStartAudio().then(function () {
    osc.start();
  });
}

function draw() {
  background(255);

  let waveform = fft.waveform(); // analyze the waveform
  beginShape();
  strokeWeight(5);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();

  // change oscillator frequency based on mouseX
  let freq = map(accX, -10, 10, 40, 880);
  // let freq = map(mouseX, 0, width, 40, 880);
  osc.freq(freq);

  let amp = map(mouseY, 0, height, 1, 0.01);
  osc.amp(amp);

  if (mouseIsPressed) {
    playing = !playing;
  }

  if (playing) {
    osc.amp(0.5);
  } else {
    osc.amp(0);
  }

}


window.addEventListener('devicemotion', ev => {
  var acc = ev.accelerationIncludingGravity;
  let aX = acc.x;
  let aY = Math.round(acc.y);
  let aZ = Math.round(acc.z);
  if (accX !== aX) {
    accX = aX;
  }
  if (accY !== aY) {
    accY = aY;
  }
  if (accZ !== aZ) {
    accZ = aZ;
  }
}, false);

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}