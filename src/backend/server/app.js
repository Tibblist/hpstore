const server = require('http').createServer()
const io = require('socket.io')(server)

export const Groups = Object.freeze({
    MEMBER: 1,
    BUILDER: 2,
    ADMIN: 3,
});

io.on('connection', function (client) {
    client.on('register', handleRegister)
    
  })
  
  server.listen(8080, function (err) {
    if (err) throw err
    console.log('listening on port 3000')
  })