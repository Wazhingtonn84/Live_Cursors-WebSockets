const http = require("http");
const url = require("url");
const { WebSocketServer } = require("ws");
const PORT = process.env.PORT || 5000;
const uuidv4 = require("uuid").v4;

// We instantiate the HTTP handshake and WS
const server = http.createServer();
const wsServer = new WebSocketServer({ server });

//Event Handlers

//Accept user requests and identify them by their credentials
const connections = {}; //connections dictionary
const users = {}; //users dictionary

wsServer.on("connection", (connection, request) => {
	//ws://localhost:5000?username=Keem  =>> Identifying the user

	const { username } = url.parse(request.url, true).query;
	const uuid = uuidv4();
	console.log(username);
	console.log(uuid);

	connections[uuid] = connection;

	users[uuid] = {
		username: username,
		state: {},
	};

	connection.on("message", (message) => handleMessage(message, uuid));
	connection.on("close", () => handleClose(uuid));
});

server.listen(PORT, (req, res) => {
	console.log(`Server listening on port ${PORT}`);
});

//
