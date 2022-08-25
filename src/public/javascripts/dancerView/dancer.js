let body;
let hide = false;
let colorB = true;
let socket = io.connect();

let sendElem;
let isSending;

let playing;
let soundElem;

let logic;
let isPermissionGranted = false;

function setup() {
  body = select('body');
  logic = new Logic();
  logic.listenSockets();
}

function draw() {
  if (isPermissionGranted) {
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

function requestPermission() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          console.log("motion event granted!");
          isPermissionGranted = true;
        }
      })
      .catch(console.error);
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response == 'granted') {
          console.log("Orientation event granted!");
        }
      })
      .catch(console.error)
      select('#permission').hide();
  } else {
    alert( "No puedo acceder a los sensores de tu dispositivo :(" );
  }
}

function hideToggle() {
  if (!hide) {
    select('#settings').hide();
    hide = true;
  } else {
    select('#settings').show();
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
