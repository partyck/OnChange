class Logic {

  constructor() {
    this.lastKey = 0;
    this.isUp = false;
    this.socket = io.connect();
  }

  sendKeyUp() {
    let newK = parseInt(newKey());
    if (this.lastKey !== newK) {
      this.socket.emit('noteDown', {
        keyDown: this.lastKey
      });
      this.socket.emit('noteUp', {
        keyUp: newK
      });
      this.lastKey = newK;
    }
  }

  sendKeyDown() {
    this.socket.emit('noteDown', {
      keyDown: this.lastKey
    });
    this.lastKey = 0;
  }
}

function newKey() {
  return map(mouseY, 0, height, 60, 72);
}