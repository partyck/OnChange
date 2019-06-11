class Logic {

  constructor() {
    this.lastKey = 0;
    this.isUp = false;
    this.socket = io.connect();
    this.session = document.getElementById("session").textContent;
  }

  sendKeyUp() {
    let newK = parseInt(newKey());
    if (this.lastKey !== newK) {
      this.socket.emit('noteDown', {
        session: this.session,
        keyDown: this.lastKey
      });
      this.socket.emit('noteUp', {
        session: this.session,
        keyUp: newK
      });
      this.lastKey = newK;
    }
  }

  sendKeyDown() {
    this.socket.emit('noteDown', {
      session: this.session,
      keyDown: this.lastKey
    });
    this.lastKey = 0;
  }
}

function newKey() {
  return map(mouseY, 0, height, 20, 72);
}