class Logic {

  constructor() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.scene = parseInt(document.getElementById("scene").textContent);
    this.session = parseInt(document.getElementById("session").textContent);
    this.socket = io.connect();
    this.accSuport = (window.DeviceMotionEvent ? true : false);
    this.listenAcc();
    this.listenSockets()
  }

  sendData() {
    if(this.scene === 1 || this.scene === 3 || this.scene === 4) {
      this.socket.emit('synth', {
        session: this.session,
        alpha: this.alpha,
        beta: this.beta,
        gamma: this.gamma
      });
    }
  }

  sendAttac() {
    console.log('sendAttac');
    this.socket.emit('attack', {
      session: this.session
    })
  }

  sendRelease() {
    console.log('sendRelease');
    this.socket.emit('release', {
      session: this.session
    });
  }

  changeScene(new_scene) {
    if (this.scene === new_scene) {
      return  
    }
    if (new_scene === 1 || new_scene === 2) {
      this.sendAttac();
    }
    else {
      this.sendRelease();
    }
    this.scene = new_scene;
    document.getElementById("scene-tag").innerHTML = `Escena: ${new_scene}`
  }

  listenSockets() {
    this.socket.on('scene', data => {
      this.changeScene(data.scene)
    });
  }

  listenAcc() {
    window.addEventListener('devicemotion', ev => {
      var acc = ev.accelerationIncludingGravity;
      this.r = map(acc.x, -9.8, 9.8, 0, 255);
      this.g = map(acc.y, -9.8, 9.8, 0, 255);
      this.b = map(acc.z, -9.8, 9.8, 0, 255);
      this.x = acc.x;
      this.y = acc.y;
      this.z = acc.z;
    });
    window.addEventListener('deviceorientation', ev => {
      this.alpha = Math.round(ev.alpha);
      this.beta = Math.round(ev.beta);
      this.gamma = Math.round(ev.gamma);
    });
  }
}

