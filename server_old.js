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
const { Client } = require('@stomp/stompjs');

// URL of the WebSocket server with STOMP support
const externalServerUrl = 'ws://walker.internal.kloudspot.com:32080/advanced/websocket';

let websocketConnected = false;

// Create a new STOMP client
const stompClient = new Client({
    brokerURL: externalServerUrl,
    connectHeaders: {
        'Authorization': 'Bearer YDAUJ7FODX7OLSV',
    },
    // Configure the WebSocket factory for Node.js
    webSocketFactory: () => new WebSocket(externalServerUrl, [], {
		"headers": {
			"Authorization": "Bearer YDAUJ7FODX7OLSV"
		} 
	}),

    // Reconnect attempts (can be set to a value like 5000ms to attempt reconnects every 5 seconds)
    reconnectDelay: 5000,

    // Callback when the client successfully connects
    onConnect: (frame) => {
        console.log('Connected to the STOMP server:', frame);
        
        websocketConnected = true;
        
        stompClient.subscribe('/user/queue/ruleNotifications', (message) => {
		    console.log('Received message:', message.body);
		});
		stompClient.publish({
		    destination: '/app/ruleNotifications/subscribe',
		    body: JSON.stringify({"type":"RuleNotificationsCriteria"}),
		});

    },

    // Callback when the client fails to connect or gets disconnected
    onStompError: (frame) => {
        console.error('Broker reported error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
    },
});

// Activate the STOMP client
stompClient.activate();








/*

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
	console.error('wss on connection:');
    // Create a WebSocket connection to the external server
    const externalSocket = new WebSocket(externalServerUrl, [], {
		"headers": {
			"Authorization": "Bearer YDAUJ7FODX7OLSV"
		} 
	});
    
    ws.send("Hello browser, How are you doing?");
    
	externalSocket.on('open', (evt) => {
		console.error('externalSocket open:', evt);
  		// Send the header with the bearer token
  		externalSocket.send('Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MWlodnRsZ2NkaXVsdDExbGhqdGNhX2dod2tjN2I3bGN5dGFzbHJwYmF1IiwiYXV0aCI6IlJPTEVfQURNSU4iLCJpZCI6IjY1MTczMmY0MTE2ZDRlNWYyNWYzYzA4NSIsImV4cCI6MTcyOTc5NTM0Nn0.thIg-fFKVgn-vKmSVp9NBFuG4sSiNNm2NRv-NMm__PPjx-Bkp2E7vVNEpo44vHvmAODll1i9yL1vjdsLMmc_ew');
	});

    // Handle messages from the client and send them to the external server
    ws.on('message', (message) => {
		console.error('message on ws:', message);
        if (externalSocket.readyState === WebSocket.OPEN) {
            externalSocket.send(message);
            console.log('Sent the message received from client to external server');
        } else {
			console.log('externalSocket.readyState is not OPEN', externalSocket.readyState);
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

*/
