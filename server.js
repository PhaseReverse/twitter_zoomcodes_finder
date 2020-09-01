const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);
//app.use(express.static('public'));
console.log('Listening on port 3000');

io.on('connection',(socket)=>{

   
    socket.on('tweetCount',tweetCount=>{
        socket.broadcast.emit('tweetCount',tweetCount);
        
    })

    socket.on('zoomUrls',zoomurls=>{
        socket.broadcast.emit('zoomUrls',zoomurls);
    })

    socket.on('searchFlag',flag =>{
        socket.broadcast.emit('searchFlag',flag);
    })



})