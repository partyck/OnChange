let socket = io.connect();
let scene = parseInt(document.getElementById("scene").textContent);
let order = ['t', 'q', 't', 't', 't', 't', 'q', 't', 'q', 't', 'q', 't'];
let textCounter = 0;
let questionCounter = 0;


document.getElementById("scene-tag").innerHTML = `Escena: ${scene}`
socket.on('scene', data => {
    scene = data.scene;
});

function changeScene(i) {
  scene = i;
  document.getElementById("scene-tag").innerHTML = `Escena: ${scene}`
  socket.emit('scene', {
    scene: scene
  });
}