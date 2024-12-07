const express = require('express');
const { WebSocketServer } = require('ws');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// WebSocket server setup
const wss = new WebSocketServer({server})

let clients = [];
let tasks = [];

wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.push(ws);

    // send current tasks to the new client
    ws.send(JSON.stringify(tasks));

    ws.on('message', (message) => {
        tasks = JSON.parse(message);
        // broadcast updated tasks to all clients
        clients.forEach(client => {
            if (client.readyState === 1) {
                clients.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients = clients.filter(client => client !== ws);
    });
});