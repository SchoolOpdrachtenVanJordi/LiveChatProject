const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(express.static('public'))


const socket = require('socket.io')
const io = socket(server)

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})



