let socket = io.connect();
let scene = 1
document.getElementById("scene-tag").innerHTML = `Escena: ${scene}`

socket.on('scene', data => {
    scene = data.scene;
});

function changeScene(i) {
    scene = i;
    console.log(`scene: ${scene}`);
    document.getElementById("scene-tag").innerHTML = `Escena: ${scene}`
    socket.emit('scene', {
      scene: scene
    });
  }
