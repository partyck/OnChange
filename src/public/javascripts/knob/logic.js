class Logic {

  constructor() {
    this.accX = 0;
    this.accY = 0;
    this.accZ = 0;
    this.session = document.getElementById("session").textContent;
    this.socket = io.connect();
    this.accSuport = (window.DeviceMotionEvent ? true : false);
  }

  sendData() {
    this.socket.emit('knob', {
      session: this.session,
      x: this.accX,
      y: this.accY,
      z: this.accZ
    });
  }

  listenAcc() {
    window.addEventListener('devicemotion', ev => {
      var acc = ev.accelerationIncludingGravity;
      // var accWOG = ev.acceleration;
      // var rot = ev.rotationRate;
      // var inter = ev.interval;
      // console.log('gravity:      ', acc);
      // console.log('acceleration: ', accWOG);
      // console.log('rotation:     ', rot);
      // console.log('interval:     ', inter);
      
      // let aX = Math.round(ev.alpha * 100) / 100;
      // let aY = Math.round(ev.beta * 100) / 100;
      // let aZ = Math.round(ev.gamma * 100) / 100;
      let aX = Math.round(acc.x * 100) / 100;
      let aY = Math.round(acc.y * 100) / 100;
      let aZ = Math.round(acc.z * 100) / 100;
      if (logic.accX !== aX) {
        logic.accX = aX;
      }
      if (logic.accY !== aY) {
        logic.accY = aY;
      }
      if (logic.accZ !== aZ) {
        logic.accZ = aZ;
      }
    });
  }

}

