const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const app = express();
const bodyParser = require("body-parser");
const routes = require("./server/routes");
const config = require('./server/config/config');

const prodMode = config.prodMode;
const port = config.serverPort || 3080;
const wss = new WebSocket.Server({ port: 3090 });

const externalServerUrl = 'wss://walker.kloudspot.com/advanced/websocket';

app.use(bodyParser.json());

app.use(express.static(process.cwd() + "/ui/dist/kspot-example-ui/"));

//Serve out the api
app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + "/ui/dist/kspot-example-ui/index.html")
});

if (prodMode) {
	app.use(express.static("ui/dist/kspot-example-ui"));
}

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
    // Create a WebSocket connection to the external server
    const externalSocket = new WebSocket(externalServerUrl);

	externalSocket.on('open', (evt) => {
		console.error('externalSocket open:', evt);
  		// Send the header with the bearer token
  		externalSocket.send('Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MWlodnRsZ2NkaXVsdDExbGhqdGNhX2dod2tjN2I3bGN5dGFzbHJwYmF1IiwiYXV0aCI6IlJPTEVfQURNSU4iLCJpZCI6IjY1MTczMmY0MTE2ZDRlNWYyNWYzYzA4NSIsImV4cCI6MTcxNjQxMjg3MX0.RfHHj5jTTo6Q5d3Ev2wKfxoW6JLa4dWqjQSspPSaltucyliHDZ8BBFzwO4B_2bJiavi_psWyvXw-o7Eogsevwg');
	});

    // Handle messages from the client and send them to the external server
    ws.on('message', (message) => {
		console.error('message on ws:', message);
        if (externalSocket.readyState === WebSocket.OPEN) {
            externalSocket.send(message);
        }
    });

    // Handle messages from the external server and send them to the client
    externalSocket.on('message', (message) => {
		console.error('message on externalSocket:', message);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    });

    // Handle connection close from the client
    ws.on('close', (evt) => {
		console.error('ws close:', evt);
        externalSocket.close();
    });

    // Handle connection close from the external server
    externalSocket.on('close', (evt) => {
		console.error('externalSocket close:', evt);
        ws.close();
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error on client connection:', error);
        externalSocket.close();
    });

    externalSocket.on('error', (error) => {
        console.error('WebSocket error on external connection:', error);
        ws.close();
    });
});


app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
