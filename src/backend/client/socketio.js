const io = require('socket.io-client')
const socket = io.connect('http://store.holepunchers.space:8080')

function registerHandler(dataType, onDataReceived) {
    socket.on(dataType, onDataReceived);
  }

function unregisterHandler(dataType) {
    socket.off(dataType);
  }

  function sendData(dataType, ...data) {
    socket.emit(dataType, ...data);
  }