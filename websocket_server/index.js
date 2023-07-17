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
        if(!vehicle.vehicle_id){
            console.log(`vehicle ${vehicle.id} has updated`)
        }else{
            console.log(`vehicle history ${vehicle.id} has updated`)
        }
    })
    socket.on('updateDriver', (driver) => {
        socket.broadcast.emit('updateDriver', driver)
        if(!driver.driver_id){
            console.log(`driver ${driver.id} has updated`)
        }else{
            console.log(`driver history ${driver.id} has updated`)
        }
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
    socket.on('updateStage', (stage) => {
        socket.broadcast.emit('updateStage', stage)
        console.log(`stage ${stage.id} has updated`)
    })
    socket.on('updateStageRun', (stageRun) => {
        socket.broadcast.emit('updateStageRun', stageRun)
        console.log(`stage run ${stageRun.id} has updated`)
    })
    socket.on('updateStageRunRaceStartTime', (stageRunRaceStart) => {
        socket.broadcast.emit('updateStageRunRaceStartTime', stageRunRaceStart)
        console.log(`Time Run Race Start ${stageRunRaceStart.id} has updated`)
    })
    socket.on('updateStageRunRaceTimeControlTime', (stageRunRaceTimeControl) => {
        socket.broadcast.emit('updateStageRunRaceTimeControlTime', stageRunRaceTimeControl)
        console.log(`Time Run Race Time Control ${stageRunRaceTimeControl.id} has updated`)
    })
    socket.on('updateFinalTimeForTimeRun', (exampleX) => {
        socket.broadcast.emit('updateFinalTimeForTimeRun', exampleX)
        console.log(`Time Run Race ${exampleX.id} has updated`)
    })
    socket.on('updateEventFinalTimeForTimeRun', (exampleY) => {
        socket.broadcast.emit('updateEventFinalTimeForTimeRun', exampleY)
        console.log(`Time Run Race ${exampleY.id} has updated`)
    })
    socket.on('updateNotesForAdminVerification', (AV) => {
        socket.broadcast.emit('updateNotesForAdminVerification', AV)
        console.log(`admin verification ${AV.id} notes has updated`)
    })
    socket.on('updateNotesForTechnicalVerification', (TV) => {
        socket.broadcast.emit('updateNotesForTechnicalVerification', TV)
        console.log(`technical verification ${TV.id} notes has updated`)
    })
})