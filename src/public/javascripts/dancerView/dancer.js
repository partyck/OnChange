let body;
let hide = false;
let colorB = true;

let sendElem;
let isSending;

let playing;
let soundElem;

let logic;

function setup() {
  body = select('body');
  logic = new Logic(0);
  listenSockets();

  sendElem = [
    select('#scene1'),
    select('#scene2'),
    select('#scene3'),
    select('#scene4'),
    select('#scene5'),
    select('#scene6')
  ];
}

function draw() {
  logic.sendData();
  printData();
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

function changeScene(scene) {
  if (logic.scene !== scene) {
    logic.sendAttac();
    activeButton(scene);
    logic.scene = scene;
  } else {
    logic.sendRelease();
    releseButton(scene);
    logic.scene = 0;
  }
}

function activeButton(scene) {
  let ele = sendElem[scene - 1];
  ele.addClass('btn-secondary');
  ele.removeClass('btn-light');
  if (logic.scene !== 0) {
    ele = sendElem[logic.scene - 1];
    ele.removeClass('btn-secondary');
    ele.addClass('btn-light');
  }
}

function releseButton(scene) {
  let ele = sendElem[scene - 1];
  ele.removeClass('btn-secondary');
  ele.addClass('btn-light');
}

function hideToggle() {
  // let hideButton = select('#hideButton')
  if (!hide) {
    select('#settings').hide();
    // hideButton.addClass('btn-outline-dark');
    // hideButton.removeClass('btn-danger');
    hide = true;
  } else {
    select('#settings').show();
    // hideButton.removeClass('btn-outline-dark');
    // hideButton.addClass('btn-danger');
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

function printData() {
  select('#alphaTag').html(logic.alpha);
  select('#betaTag').html(logic.beta);
  select('#gammaTag').html(logic.gamma);
}

function listenSockets() {
  // logic.socket.on('scene', data => {
  //   if (data.scene != 1 || data.scene != 3) {
  //     changeScene(data.scene);
  //   }
  // });
}