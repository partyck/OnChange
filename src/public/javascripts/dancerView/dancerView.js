let font, fontSize = 30;
let logic;

let showingSettings;

function preload() {
  font = loadFont('assets/BebasNeue-Regular.ttf');
}

function setup() {
  logic = new Logic();
  logic.listenAcc();
  showingSettings = false;
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  rectMode(CENTER);
  textFont(font);
  textSize(fontSize);
  createButtons();
}

function draw() {
  // logic.sendData();
  printBackground();
  printLabel();
}

function printBackground() {
  let e = 1;
  if (getMobileOperatingSystem() === "iOS") {
    e = -1;
  }
  var red = map(e * logic.accX, -9.81, 9.81, 0, 255);
  var green = map(e * logic.accY, -9.81, 9.81, 0, 255);
  var blue = map(e * logic.accZ, -9.81, 9.81, 0, 255);
  background(red, green, blue);
}

function printLabel() {
  textSize(100);
  let knobLabel = 'KNOB';
  text(knobLabel, 20, 100);

  // textSize(fontSize);
  // let sessionLabel = 'SESSION:    ' + logic.session;
  // text(sessionLabel, 20, 140);
  // let accLabel = 'Acelerometer:    ' + logic.accSuport;
  // text(accLabel, 20, 180);
  textSize(fontSize);
  let sessionLabel = 'enviar';
  text(sessionLabel, 20, 140);

}

function createButtons() {
  let hideB = createButton("X");
  hideB.position(width - 80, 0);
  hideB.size(80,80);
  hideB.addClass("btn btn-outline-info btn-hide");
  hideB.mousePressed(toggleShowSettings);

  let divSend = createDiv();
  divSend.addClass('btn-group btn-group-toggle');
  // div.child(sendL);

}

function toggleShowSettings() {
  if (showingSettings) {
    
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function getMobileOperatingSystem() {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }
  return "unknown";
}