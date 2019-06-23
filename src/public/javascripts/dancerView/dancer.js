var attackLevel = 1;
var releaseLevel = 0;

var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 1;
var releaseTime = 0.5;

let body;
let hide = false;
let colorB = true;
let isInteraction = false;

let sendElem;
let isSending;

let playing;
let soundElem;

let logic;
let numOsc = 3;
let osca, enva;

function setup() {
  body = select('body');
  logic = new Logic();
  logic.listenAcc();

  soundElem = [
    select('#soundAlpha'),
    select('#soundBeta'),
    select('#soundGamma')
  ];

  sendElem = [
    select('#sendAlpha'),
    select('#sendBeta'),
    select('#sendGamma')
  ];

  playing = [false, false, false];
  isSending = [false, false, false];

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

  logic.socket.on('sound', data => {
    if (data.session === logic.session) {
      sound(data.index);
      isInteraction = true;
    }
  });

  userStartAudio().then(function () {

  });
}

function draw() {
  logic.sendData(isSending);
  printData();
  if (isInteraction) {
    stopOsc();
  }
  if (playing[0]) {
    osca[0].freq(map(logic.alpha, 0, 360, 40, 1000));
  }
  if (playing[1]) {
    osca[1].freq(map(abs(logic.beta + 90), 0, 180, 1000, 40));
  }
  if (playing[2]) {
    osca[2].freq(map(logic.gamma, -90, 90, 40, 1000));
  }
  if (colorB) {
    if (getMobileOperatingSystem() == 'iOS') {
      let col = color(255 - logic.r, 255 - logic.g, 255 - logic.b);
      body.style('background-color', col);
    } else {
      let col = color(logic.r, logic.g, logic.b);
      body.style('background-color', col);
    }
  } else {
    let col = color(0);
    body.style('background-color', col);
  }
}

function send(index) {
  let ele = sendElem[index];
  if (!isSending[index]) {
    if (index === 0) {
      logic.sendAttac();
    }
    // logic.sendAttac();
    ele.addClass('btn-secondary');
    ele.removeClass('btn-light');
    isSending[index] = true;
  } else {
    if (index === 0) {
      logic.sendRelease();
    }
    // logic.sendRelease();
    ele.removeClass('btn-secondary');
    ele.addClass('btn-light');
    isSending[index] = false;
  }
}

function sound(index) {
  let ele = soundElem[index];
  if (!playing[index]) {
    ele.addClass('btn-secondary');
    ele.removeClass('btn-light');
    enva[index].triggerAttack();
    playing[index] = true;
  } else {
    ele.removeClass('btn-secondary');
    ele.addClass('btn-light');
    enva[index].triggerRelease();
    playing[index] = false;
  }
}

function hideToggle() {
  let hideButton = select('#hideButton')
  if (!hide) {
    select('#settings').hide();
    hideButton.addClass('btn-outline-dark');
    hideButton.removeClass('btn-danger');
    hide = true;
  } else {
    select('#settings').show();
    hideButton.removeClass('btn-outline-dark');
    hideButton.addClass('btn-danger');
    hide = false;
  }
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

function colorToggle() {
  let ele = select('#colorB');
  if (!colorB) {
    ele.addClass('btn-secondary');
    ele.removeClass('btn-light');
    colorB = true;
  } else {
    colorB = false;
    ele.removeClass('btn-secondary');
    ele.addClass('btn-light');
  }
}

function stopOsc() {
  // console.log('game: ');
  if (logic.beta < -80 && logic.beta > -100) {
    sound(1);
    isInteraction = false;
  }
}

function printData() {
  select('#alphaTag').html(logic.alpha);
  select('#betaTag').html(logic.beta);
  select('#gammaTag').html(logic.gamma);
}