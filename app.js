const WebSocket = require('ws');
const express = require('express')
const app = express();

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8081 });
var playerOne, playerTwo, playerThree, computer
var PlayerOneReady = false;
var PlayerTwoReady = false;
var gameInProgress = false;


wss.on('connection', (ws) => {
    console.log('A new client connected');

    // Send a welcome message to the client
    /**
     * Normalized Objkect sent from client
     * PLayerID: Int
     * dataToSend: String
     */

    // Update delay for data from player to server

    ws.send('Welcome to the WebSocket server!');
    ws.on("message", (msg) => {
        var data = JSON.parse(msg);
        console.log(data);
        
        if(data) {
            var typeOfDataSend = ""
            // console.log(data.PlayerId);
            
            if(!data.PlayerId) {
                return 
            }
            // console.log(data.playerId);
            
            switch (data.PlayerId) {
                case 1:
                    playerOne = ws;
                    PlayerOneReady = data.DataToSend.ready || false;
                    break;
                case 2:
                    playerTwo = ws;
                    PlayerTwoReady = data.DataToSend.ready || false;
                    break;
                case 3:
                    playerThree = ws;
                    break;
                default:
                    break;
            }
            // console.log(data.DataToSend);
            if(data.DataToSend.Posistion) {
                typeOfDataSend = "Position"
            }
            // console.log(typeOfDataSend);
            
            if(playerOne && typeOfDataSend == "Position") {
                //secondaryJSON
                playerOne.send(JSON.stringify({
                    PlayerId: data.PlayerId,
                    typeOfCommand: typeOfDataSend,
                    DataToSend: data.DataToSend
                }))
            }
            if(playerTwo && typeOfDataSend == "Position") {
                playerTwo.send(JSON.stringify({
                    PlayerId: data.PlayerId,
                    typeOfCommand: typeOfDataSend,
                    DataToSend: data.DataToSend
                }))
            }
            if(playerThree && typeOfDataSend == "Position") {
                console.log(data.PlayerId);
                
                playerThree.send(JSON.stringify({
                    PlayerId: data.PlayerId,
                    typeOfCommand: typeOfDataSend,
                    DataToSend: data.DataToSend
                }))
            }
            if(computer) {
                computer.send(JSON.stringify({
                    PlayerId: data.PlayerId,
                    typeOfCommand: typeOfDataSend,
                    DataToSend: data.DataToSend
                }))
            }

            // wss.clients.forEach(function each(client) {
            //     // console.log(client.isPaused);
            //     console.log(data);
            //     var secondaryJSON = data.dataToSend
                
            //     client.send("hello!");
            //  });

            
            // // playerThree.send(JSON.stringify(msg))
            // // computer.send(JSON.stringify(msg))
            // ws.send(JSON.stringify({
            //     message: 'Ok'
            // }));
        }

    })

    // Handle messages from the client
    ws.on('message', (message) => {
        // console.log(`Received message: ${message}`);

        // Echo the message back to the client
        ws.send(`You sent: ${playerOne}`);
    });


    // Handle when the client disconnects
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', () => {
        console.error('WebSocet error:', error);
    })

});

// Define the /start route
app.get('/start', (req, res) => {
    if (gameInProgress) {
        res.send('Game is already in progress.');
    } else if (PlayerOneReady && PlayerTwoReady) {
        gameInProgress = true;
        // Send a message to both players via WebSocket
        if (playerOne) {
            playerOne.send(JSON.stringify({
                message: "Game started",
                status: "ready"
            }));
        }
        if (playerTwo) {
            playerTwo.send(JSON.stringify({
                message: "Game started",
                status: "ready"
            }));
        }
        res.send('Both players are ready. Game started!');
    } else {
        res.send('Players are not ready yet.');
    }
});

app.get('/restart', (request, response) => {
     gameInProgress = false;
     PlayerOneReady = false;
     PlayerTwoReady = false;

     if (playerOne) {
        playerOne.send(JSON.stringify({
            message: "Game has been restarted. Please get ready.",
            status: "restart"
        }));
     }

     if (playerTwo) {
        playerTwo.send(JSON,stringify({
            message: "Game has been restarted. Please get ready.",
            status: "restart"
        }));
     }

     if (playerThree) {
        playerThree.send(JSON.stringify({
            message: "Game has been restarted",
            status: "restart"
        }));
     }

     res.send('Game has been restarted');
});

const expressPort = 3000;
app.listen(expressPort, () => {
    console.log(`Express server running on port ${expressPort}`);
});

console.log('WebSocket server is listening on ws://localhost:8081');

// Create an express server
// that takes one route
// checks that when playe hits start that check both are ready sends a web socket 