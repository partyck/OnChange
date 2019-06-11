let font, fontSize = 130;
let options = ["knob", "kick", "keyboard"];

function preload() {
  font = loadFont('assets/BebasNeue-Regular.ttf');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont(font);
  textSize(fontSize);
  background(0);

  fill(255);
  noStroke();
  let thusLabel = "THUS";
  textAlign(CENTER, CENTER);
  text(thusLabel, width * 0.5, height * 0.1);



  options.forEach((option, index) => {
    stroke(255, 204, 0);
    strokeWeight(4);
    fill(204);
    let optionHeight = (0.75 / options.length);
    let optionHeightPosition = optionHeight * (index + 1);
    rectangle = rect(0, height * optionHeightPosition, width, height * optionHeight);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    let optionLabel = option;
    text(optionLabel, width * 0.5, height * (optionHeightPosition + 0.1));

  });

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
