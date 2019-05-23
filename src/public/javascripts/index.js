let font, fontSize = 130;
let knob, kick, keyboard;

function preload() {
  font = loadFont('assets/BebasNeue-Regular.ttf');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont(font);
  textSize(fontSize);
  background(0);

  stroke(255, 204, 0);
  strokeWeight(4);
  fill(204);
  knob = rect(0, height * 0.25, width, height * 0.25);
  kick = rect(0, height * 0.5, width, height * 0.25);
  keyboard = rect(0, height * 0.75, width, height * 0.25);

  fill(255);
  noStroke();
  let thusLabel = "THUS";
  textAlign(CENTER, CENTER);
  text(thusLabel, width * 0.5, height * 0.1);

  fill(0);
  let knobLabel = "KNOB";
  text(knobLabel, width * 0.5, height * 0.35);

  let kickLabel = "KICK";
  text(kickLabel, width * 0.5, height * 0.6);

  let keyLabel = "KEYS";
  text(keyLabel, width * 0.5, height * 0.85);
}
function mouseReleased() {
  if (mouseY > height * 0.75) {
    window.location.href = "/keyboard";
  } else {
    if (mouseY > height * 0.5) {
      window.location.href = "/kick";
    } else {
      if (mouseY > height * 0.25) {
        window.location.href = "/knob";
      }
    }
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  setup();
}
