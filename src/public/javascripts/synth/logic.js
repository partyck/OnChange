class Logic {

  constructor() {
    this.accX = 0;
    this.accY = 0;
    this.accZ = 0;
    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;
    this.session = document.getElementById("session").textContent;
    this.socket = io.connect();
    this.accSuport = (window.DeviceMotionEvent ? true : false);
  }

  sendData() {
    this.socket.emit('synth', {
      session: this.session,
      x: this.accX,
      y: this.accY,
      z: this.accZ,
      alpha: this.alpha,
      beta: this.beta,
      gamma: this.gamma
    });
  }

  sendtriggerRelease(){
    this.socket.emit('release', {
      session: this.session
    });
  }

  sendTriggerAttack(){
    this.socket.emit('attack', {
      session: this.session
    });
  }

  listenAcc() {
    window.addEventListener('devicemotion', ev => {
      var acc = ev.accelerationIncludingGravity;
      this.accX = acc.x;
      this.accY = acc.y;
      this.accZ = acc.z;
    });
    window.addEventListener('deviceorientation', ev => {
      this.alpha = Math.round(ev.alpha);
      this.beta = Math.round(ev.beta);
      this.gamma = Math.round(ev.gamma);
    });
  }

}

