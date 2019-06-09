const midi = require('midi');
const midiOut = new midi.output();
const socket = require('socket.io');

midiOut.openVirtualPort('');

function scale(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

module.exports = server => {
  let io = socket(server);

  let dotSocket = io.of('/')
    .on('connection', socket => {

      socket.on('knob', data => {
        let xmidi = scale(data.y, -9.81, 9.81, 0, 128);
        if (data.session < 16) {
          let channelX = parseInt(data.session) + 176;
          midiOut.sendMessage([channelX, 0, xmidi]);
        }
      });

      socket.on('kick', data => {
        let kick = parseInt(data.session) + 95;
        console.log('kick session: ', kick);
        midiOut.sendMessage([144, kick, 120]);
        midiOut.sendMessage([128, kick, 120]);
        // midiOut.sendMessage([144, kick + 1, 120]);
        // midiOut.sendMessage([128, kick + 1, 120]);
      });

      socket.on('noteUp', data => {
        console.log('note: ', data.keyUp);
        midiOut.sendMessage([144, data.keyUp, 100]);
      });

      socket.on('noteDown', data => {
        console.log('noteDown: ', data.keyDown);
        midiOut.sendMessage([128, data.keyDown, 100]);
      });

      socket.on('synth', data => {
        console.log('synth', data);
        io.emit('synth', data);
      });

      socket.on('attack', data =>{
        console.log('attack', data);
        io.emit('attack', data);
      });

      socket.on('release', data =>{        
        console.log('release', data);
        io.emit('release', data);
      });

    });
};