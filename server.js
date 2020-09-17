//Imports
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const { connect } = require('http2');
const PORT = process.env.PORT || 8080;

var Game = require('./game.js');
let game = new Game;

//Instantiate Express, Http and Socket IO
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Setting static files folder
app.use(express.static(path.join(__dirname, 'public')));

//Starting the server
server.listen(PORT, () =>
{
    console.log(`Server running on ${PORT}`);
});

//Handle socket connections
let connections = [null, null];

require('./game')(io);

io.on('connection', function(socket)
{
    //Find avalidable player number
    var playerIndex = -1;
    for (const i in connections)
    {
        if (connections[i] === null)
        {
            playerIndex = i;
            connections[i] = playerIndex;
            break;
        }
    }

    //Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex);
    console.log(`Player ${playerIndex} has connected`);

    //Ignore player 3
    if (playerIndex === -1) return;

    if (connections[0] != null && connections[1] != null)
    {
        //Start the game
        game.start();
        //Show that game is live
        io.emit('player-connected-disconnected', 'Game is live!');
        console.log('Table full!');
    }

    socket.on('disconnect',() =>
    {
        //Free the slot
        connections[playerIndex] = null;
        console.log(`Player ${playerIndex} has disconnected.`)
        playerIndex--;
        //Show waiting for players
        io.emit('player-connected-disconnected', 'Waiting for opponent...');
        //Ending game in game.js
    })
});