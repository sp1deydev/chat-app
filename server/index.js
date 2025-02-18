const express = require('express')
require('dotenv').config()
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
app.use(cors())

const PORT = process.env.PORT || 3001

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
})

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id)
    })
})



server.listen(PORT, () => {
  console.log(`Chat app server listening on port ${PORT}`)
})