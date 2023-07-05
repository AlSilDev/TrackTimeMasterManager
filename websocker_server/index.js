const httpServer = require('http').createServer()
const io = require("socket.io")(httpServer, {
    cors: {
    // The origin is the same as the Vue app domain. Change if necessary
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
    credentials: true
    }
})

httpServer.listen(8080, () =>{
    console.log('listening on *:8080')
})

io.on('connection', (socket) => {
    console.log(`user ${socket.id} has connected`)
    socket.on('userBlockValueChange', (user) => {
        socket.broadcast.emit("userBlockValueChange", user);
        console.log(`user ${user.id} blocked value updated. (${user.blocked})`)
    })
    socket.on('updateUser', (user) => {
        socket.broadcast.emit('updateUser', user)
        console.log(`user ${user.id} has updated`)
    })
    socket.on('updateVehicle', (vehicle) => {
        socket.broadcast.emit('updateVehicle', vehicle)
        console.log(`vehicle ${vehicle.id} has updated`)
    })
    socket.on('updateDriver', (driver) => {
        socket.broadcast.emit('updateDriver', driver)
        console.log(`driver ${driver.id} has updated`)
    })
    socket.on('updateEvent', (event) => {
        socket.broadcast.emit('updateEvent', event)
        console.log(`event ${event.id} has updated`)
    })
})