const httpServer = require('http').createServer()
const io = require("socket.io")(httpServer, {
    cors: {
    // The origin is the same as the Vue app domain. Change if necessary
    origin: "http://193.37.152.93/beta",
    methods: ["GET", "POST"],
    credentials: true
    }
})

httpServer.listen(8081, () =>{
    console.log('listening on *:8081')
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
    socket.on('createNewEventEnrollment', (enrollment) => {
        socket.broadcast.emit('createNewEventEnrollment', enrollment)
        console.log(`enrollment ${enrollment.id} has created`)
    })
    socket.on('removeEventEnrollment', (enrollment) => {
        socket.broadcast.emit('removeEventEnrollment', enrollment)
        console.log(`enrollment ${enrollment.id} has removed`)
    })
    socket.on('changeRunOrdersOfEventEnrollments', (UpdatedEnrollments) => {
        socket.broadcast.emit('changeRunOrdersOfEventEnrollments', UpdatedEnrollments)
        console.log(`enrollments ${UpdatedEnrollments.length} has updated run order`)
    })
    socket.on('approveAdminVerification', (AVapproved) => {
        socket.broadcast.emit('approveAdminVerification', AVapproved)
        console.log(`admin verification ${AVapproved.id} has approved`)
    })
    socket.on('repproveAdminVerification', (AVrepproved) => {
        socket.broadcast.emit('repproveAdminVerification', AVrepproved)
        console.log(`admin verification ${AVrepproved.id} has repproved`)
    })
    socket.on('approveTechnicalVerification', (TVapproved) => {
        socket.broadcast.emit('approveTechnicalVerification', TVapproved)
        console.log(`technical verification ${TVapproved.id} has approved`)
    })
    socket.on('repproveTechnicalVerification', (TVrepproved) => {
        socket.broadcast.emit('repproveTechnicalVerification', TVrepproved)
        console.log(`technical verification ${TVrepproved.id} has repproved`)
    })
})