var path = require('path')
var http = require('http')
var express = require('express')
var socketio = require('socket.io')
var Filter = require('bad-words')
var { generateMessage,generateLocation } = require('../src/utils/messages')

var { addUser,removeUser,getUser,getUserInRoom } = require('./utils/user')
var app = express()
var server = http.createServer(app)
var io = socketio(server)

var port = process.env.PORT || 3000
var publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//var count = 0;

//var send1 = 'Welcome'

io.on('connection', (socket)=>{
    console.log('New Socket Io connection')

    //socket.emit('message', generateMessage('Welcome'))
    //socket.broadcast.emit('message', generateMessage('Welcome for new user joined'))
    socket.on('join', (options, callback)=>{

        var { error, user } = addUser({ id: socket.id, ...options})
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        callback()
    })

    

    socket.on('sendMessage', (message, callback) =>{

        var user = getUser(socket.id)
        
        var filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profinatity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
        
    })

    socket.on('disconnect', ()=>{

        var user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage('Admin', `${ user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation', (coords, callback)=>{
        var user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocation(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    //socket.on('')

    /*socket.emit('countUpdated', count)
    socket.on('increment', ()=>{
        count++
        //socket.emit('countUpdated', count)
        io.emit('countUpdated', count)
    })*/
})

server.listen(port, ()=>{
    console.log(`server is up on running ${port}`)
})
