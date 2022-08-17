const midi = require('midi');
const midiOut = new midi.Output();
const socket = require('socket.io');

midiOut.openVirtualPort('');

let scene = 1;

function scale(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function pitchBen(chanel) {
  let message = "1110";
  let str = parseInt(chanel).toString(2);
  for (let i = 0; i < 6 - str.length; i++) {
    str = "0" + str;
  }
  message = message + str;
  return parseInt(message, 2);
}

function fillZeros(value, size) {
  let res = parseInt(value).toString(2);
  while (size - res.length > 0) {
    res = '0' + res;
  }
  return res;
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
        io.emit('synth', data);
      });

      socket.on('attack', data => {
        // console.log('attack', data);
        io.emit('attack', data);
      });

      socket.on('release', data => {
        // console.log('release', data);
        io.emit('release', data);
      });

      socket.on('sound', data => {
        // console.log('sound: ', data);
        io.emit('sound', data);
      });

      socket.on('question', data => {
        // console.log('question: ', { data });
        io.emit('question', data);
      });

      socket.on('scene', data => {
        io.emit('scene', data);
      });

      socket.on('color', data => {
        io.emit('color', data);
      });

      socket.on('audienceAnswer', data => {
        // console.log(`audienceAnswer: ${data.a}`);
        io.emit('audienceAnswer', data);
      });

      socket.on('text', data => {
        // console.log(`audienceAnswer: ${data.a}`);
        io.emit('text', data);
      });

      socket.on('finale', data => {
        // console.log(`finale: ${data.a}`);
        io.emit('finale', data);
      });

      socket.on('questionAudience', data => {
        // console.log(`finale: ${data.a}`);
        io.emit('questionAudience', data);
      });

    });
};