const express = require('express')
const app = express()

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res){
    res.render('index')
});

const server = app.listen(3000);
const io = require('socket.io')(server)

io.on('connection', (socket) => {
	socket.username = "MonkeyBat"

    socket.on('change_username', (data) => {
        socket.username = data.username;
        io.sockets.emit('is_online', {message: '🔵<i>' + socket.username + ' joined'})
    })
    socket.on('disconnect', (data) => {
        io.sockets.emit('is_online', {message: '🔴<i>' + socket.username + ' left'})
    })

    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})