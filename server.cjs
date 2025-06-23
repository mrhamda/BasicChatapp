require('dotenv').config()

const PORT = process.env.PORT || 3000

const cors = require('cors')

const io = require('socket.io')(3000, {
    cors: "http://localhost:5173"
})

const express = require('express')

const app = express()

app.use(express.json())
app.use(cors())




io.on("connection", socket => {
    console.log(socket.id)

    socket.on("send-msg", (msg, user, room) => {
        socket.to(room).emit("recieve-msg", msg, user)
    })


    socket.on("join-room", async (room, user) => {
        socket.join(room)

        socket.to(room).emit("entered-room", user)

       
    })
})




app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})