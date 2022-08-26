let scene = 0;
let order = ['t', 'q', 't', 't', 't', 't', 'q', 't', 'q', 't', 'q', 't'];

function setScene(newScene) {
    scene = newScene;
}

function getScene() {
    return scene;
}


module.exports = {getScene, setScene};