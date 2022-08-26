const midi = require('midi');
const midiOut = new midi.Output();
const socket = require('socket.io');
let scene = require('../scene.js')

midiOut.openVirtualPort('');


function scale(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

module.exports = server => {
  let io = socket(server);

  let dotSocket = io.of('/')
    .on('connection', socket => {

      socket.on('knob', data => {
        // let xmidi = scale(data.y, -9.81, 9.81, 0, 128);
        let alphamidi = scale(data.alpha, 0, 360, 0, 128);
        if (data.session < 16) {
          let channelX = parseInt(data.session) + 176;
          console.log('knob', data.session);
          console.log('chanel: ', channelX);
          console.log('value: ', alphamidi);
          midiOut.sendMessage([channelX, 0, alphamidi]);
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
        let channel = "1001";
        let str = parseInt(data.session - 1).toString(2);
        for (let i = 0; i < 6 - str.length; i++) {
          str = "0" + str;
        }
        channel = channel + str;
        console.log('noteUp', channel);
        midiOut.sendMessage([parseInt(channel, 2), data.keyUp, 100]);
      });

      socket.on('noteDown', data => {
        let channel = "1000";
        let str = parseInt(data.session).toString(2);
        for (let i = 0; i < 6 - str.length; i++) {
          str = "0" + str;
        }
        channel = channel + str;
        console.log('noteDown', channel);
        midiOut.sendMessage([parseInt(channel, 2), data.keyDown, 100]);
      });

      socket.on('synth', data => {
        console.log('synth socket: ', {data});
        io.emit('synth', data);
      });

      socket.on('attack', data => {
        console.log('attack: ', {data});
        io.emit('attack', data);
      });

      socket.on('release', data => {
        console.log('release: ', {data});
        io.emit('release', data);
      });

      socket.on('sound', data => {
        io.emit('sound', data);
      });

      socket.on('scene', data => {
        scene.setScene(data.scene);
        io.emit('scene', data);
      });

      socket.on('color', data => {
        io.emit('color', data);
      });

      socket.on('audienceAnswer', data => {
        io.emit('audienceAnswer', data);
      });

      socket.on('text', data => {
        console.log("text: ", data.index);
        io.emit('text', data);
      });

      socket.on('question', data => {
        console.log('question: ', data.index);
        io.emit('question', data);
      });

      socket.on('finale', data => {
        io.emit('finale', data);
      });

      socket.on('questionAudience', data => {
        io.emit('questionAudience', data);
      });

    });
};