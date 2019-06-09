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
    this.socket.emit('synth', {
      session: this.session,
      x: this.accX,
      y: this.accY,
      z: this.accZ
    });
  }

  sendtriggerRelease(){
    this.socket.emit('release', {});
  }

  sendTriggerAttack(){
    this.socket.emit('attack', {});
  }

  listenAcc() {
    window.addEventListener('devicemotion', ev => {
      var acc = ev.accelerationIncludingGravity;
      logic.accX = acc.x;
      logic.accY = acc.y;
      logic.accZ = acc.z;
    });
  }

}

