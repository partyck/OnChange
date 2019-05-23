class Logic {

  constructor() {
    this.accX = 0;
    this.accY = 0;
    this.accZ = 0;
    this.accLimitOn = 40;
    this.lastValue = 0;
    this.session = document.getElementById("session").textContent;
    this.socket = io.connect();
    this.accSuport = (window.DeviceMotionEvent ? true : false);
  }

  sendData() {
    let newValue = Math.sqrt(Math.pow(this.accX, 2) + Math.pow(this.accY, 2) + Math.pow(this.accZ, 2));
    if (newValue > this.accLimitOn) {
      if(this.lastValue > 3){
        this.socket.emit('kick', {
          session: this.session
        });
        this.lastValue = 0;
      }else{
        this.lastValue++;
      }
    }
  }

  listenAcc() {
    window.addEventListener('devicemotion', ev => {
      var acc = ev.acceleration;
      let aX = Math.round(acc.x);
      let aY = Math.round(acc.y);
      let aZ = Math.round(acc.z);
      if (logic.accX !== aX) {
        logic.accX = aX;
      }
      if (logic.accY !== aY) {
        logic.accY = aY;
      }
      if (logic.accZ !== aZ) {
        logic.accZ = aZ;
      }
    }, false);
  }

}