class Logic {

  constructor(scene) {
    this.scene = scene;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.session = document.getElementById("session").textContent;
    this.socket = io.connect();
    this.accSuport = (window.DeviceMotionEvent ? true : false);
    this.listenAcc();
  }

  sendData() {
    if (this.scene == 1 || this.scene == 2) {
      this.socket.emit('synth', {
        session: this.session,
        key: 'beta',
        value: this.beta
      });
    }
    if (this.scene == 3) {
      this.socket.emit('synth', {
        session: this.session,
        key: 'alpha',
        value: this.alpha
      });
    }
    // switch (this.scene) {
    //   case 1:
    //     this.socket.emit('synth', {
    //       session: this.session,
    //       key: 'beta',
    //       value: this.beta
    //     });
    //     break;
    //   case 2:
    //     this.socket.emit('synth', {
    //       scene: 2,
    //       session: this.session,
    //       key: 'alpha',
    //       value: this.alpha
    //     });
    //     if (this.session === 3) {
    //       this.socket.emit('color', {
    //         scene: 2,
    //         session: this.session,
    //         key: 'beta',
    //         value: this.beta
    //       });
    //     }
    //     break;
    //   case 3:
    //     this.socket.emit('synth', {
    //       scene: 3,
    //       session: this.session,
    //       key: 'alpha',
    //       value: this.alpha
    //     });
    //     break;
    //   default:
    //     break;
    // }
  }

  sendAttac() {
    this.socket.emit('attack', {
      session: this.session
    })
  }

  sendRelease() {
    this.socket.emit('release', {
      session: this.session
    });
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

