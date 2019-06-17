class Logic {

  constructor() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.session = document.getElementById("session").textContent;
    this.socket = io.connect();
    this.accSuport = (window.DeviceMotionEvent ? true : false);
  }

  sendData(isSending) {
    if (isSending[0]) {
      this.socket.emit('alpha', {
        session: this.session,
        alpha: this.alpha
      });
    }
    if (isSending[1]) {
      this.socket.emit('beta', {
        session: this.session,
        beta: this.beta
      });
    }
    if (isSending[2]) {
      this.socket.emit('gamma', {
        session: this.session,
        gamma: this.gamma
      });
    }
  }

  listenAcc() {
    window.addEventListener('devicemotion', ev => {
      var acc = ev.accelerationIncludingGravity;
      this.r = map(acc.x, -9.8, 9.8, 0, 255);
      this.g = map(acc.y, -9.8, 9.8, 0, 255);
      this.b = map(acc.z, -9.8, 9.8, 0, 255);
    });
    window.addEventListener('deviceorientation', ev => {
      this.alpha = Math.round(ev.alpha);
      this.beta = Math.round(ev.beta);
      this.gamma = Math.round(ev.gamma);
    });
  }

}

