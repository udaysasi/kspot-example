const express = require('express');
const app = express();
const WebSocket = require('ws');
const Stomp = require('stompjs');
const bodyParser = require("body-parser");
const routes = require("./server/routes");
const config = require('./server/config/config');
const prodMode = config.prodMode;

const port = config.serverPort || 3080;
const wsport = config.websocketPort || 3090;
const externalServerUrl = 'ws://walker.internal.kloudspot.com:32080/advanced/websocket';

class StompProxy {
	constructor() {
		this.stompClient = null;
		this.connections = {};
	}

	connectToExternalServer() {
		this.stompClient = Stomp.over(new WebSocket(externalServerUrl, [], {
			"headers": {
				"Authorization": "Bearer YDAUJ7FODX7OLSV"
			}
		}));

		this.stompClient.connect({}, () => {
			console.log('Connected to external STOMP server');
		}, (error) => {
			console.error('STOMP connection error:', error);
		});
	}

	startWebSocketServer(port) {
		const wss = new WebSocket.Server({ port });
		console.log(`WebSocket server is running on ws://localhost:${port}`);

		wss.on('connection', (ws) => {
			console.log('New WebSocket connection established');
			const stompClient = this.stompClient;
			const subscriptions = new Map(); // Map to track subscriptions by ID

			ws.on('message', (message) => {
				let messageStr;
				if (typeof message !== 'string') {
					// Convert binary data to a string
					messageStr = message.toString();
				} else {
					messageStr = message;
				}

				// Parse the STOMP frame
				const lines = messageStr.split('\n');
				const command = lines[0].trim();
				const headers = {};
				let body = null;

				// Parse headers
				for (let i = 1; i < lines.length; i++) {
					const line = lines[i].trim();
					if (line === '') {
						// An empty line indicates the start of the body
						body = lines.slice(i + 1).join('\n').trim();
						break;
					}
					const [key, value] = line.split(':');
					headers[key] = value;
				}
				console.log(headers);

				// Handle different STOMP commands
				switch (command) {
					case 'CONNECT':
						// Respond to the CONNECT command with a CONNECTED frame
						ws.send(`CONNECTED\nversion:1.2\nheart-beat:0,0\n\n\0`);
						break;
					case 'SUBSCRIBE':
						const destination = headers.destination;
						const subscriptionId = headers.id;
						if (destination && stompClient) {
							const subscription = stompClient.subscribe(destination, (frame) => {
								console.log("Sending data to the client", frame.body);
								//ws.send(`MESSAGE\ndestination:${destination}\nsubscription:${subscriptionId}\n\n${frame.body}\0`);
								ws.send(`MESSAGE\ndestination:${destination}\nsubscription:${subscriptionId}\ncontent-type:application/json\ncontent-length:${frame.body.length}\n\n${frame.body}\0`); // Relay the message back to the browser
							});
							// Store the subscription by ID
							subscriptions.set(subscriptionId, subscription);
							ws.send(`SUBSCRIBED\ndestination:${destination}\n\n\0`);
						}
						break;
					case 'UNSUBSCRIBE':
						const unsubId = headers.id;
						if (unsubId && subscriptions.has(unsubId)) {
							// Unsubscribe and remove the subscription from the map
							subscriptions.get(unsubId).unsubscribe();
							subscriptions.delete(unsubId);
							ws.send(`UNSUBSCRIBED\nid:${unsubId}\n\n\0`);
						} else {
							console.error('No subscription found for ID:', unsubId);
							ws.send(`ERROR\nmessage:No subscription found for ID ${unsubId}\n\n\0`);
						}
						break;
					case 'SEND':
						const sendDestination = headers.destination;
						console.log('SEND body', body);
						if (sendDestination && stompClient) {
							stompClient.send(sendDestination, {}, body);
						}
						break;
					default:
						console.error('Unsupported STOMP command:', command);
						ws.send(`ERROR\nmessage:Unsupported STOMP command\n\n\0`);
				}
			});

			ws.on('close', () => {
				console.log('WebSocket connection closed');
				// Unsubscribe all subscriptions when the WebSocket connection is closed
				subscriptions.forEach((subscription, id) => {
					subscription.unsubscribe();
				});
				subscriptions.clear();
			});
		});

	}

	run(port) {
		this.connectToExternalServer();
		this.startWebSocketServer(port);
	}
}

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

app.listen(port, () => {
	console.log(`Server listening on the port::${port}`);
});

const proxy = new StompProxy();
proxy.run(wsport);
