const server = require('http').createServer()
const io = require('socket.io')(server)

export const Groups = Object.freeze({
    MEMBER: 1,
    BUILDER: 2,
    ADMIN: 3,
});

io.on('connection', function (client) {
    client.on('register', handleRegister)
  
    client.on('join', handleJoin)
  
    client.on('leave', handleLeave)
  
    client.on('message', handleMessage)
  
    client.on('chatrooms', handleGetChatrooms)
  
    client.on('availableUsers', handleGetAvailableUsers)
  
    client.on('disconnect', function () {
      console.log('client disconnect...', client.id)
      handleDisconnect()
    })
  
    client.on('error', function (err) {
      console.log('received error from client:', client.id)
      console.log(err)
    })
  })
  
  server.listen(8080, function (err) {
    if (err) throw err
    console.log('listening on port 3000')
  })