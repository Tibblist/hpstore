const io = require('socket.io-client')
const socket = io.connect('http://localhost:3000')

function registerHandler(dataType, onDataReceived) {
    socket.on(dataType, onDataReceived);
  }

function unregisterHandler(dataType) {
    socket.off(dataType);
  }

  function sendData(dataType, ...data) {
    socket.emit('register', ...data);
  }