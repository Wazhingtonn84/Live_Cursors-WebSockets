const http = require("http");
const url = require("url");
const { WebSocketServer } = require("ws");
const PORT = process.env.PORT || 5000;
const uuidv4 = require("uuid").v4;

// We instantiate the HTTP hadshake and WS
const server = http.createServer();
const wsServer = new WebSocketServer({ server });

//Accept user requests and identify them by their credentials
const connections = {}; //connections dictionary
const users = {}; //users dictionary

//Event Handlers
const broadcast = () => {
	Object.keys(connections).forEach((uuid) => {
		const connection = connections[uuid];
		const message = JSON.stringify(users);
		connection.send(message);
	});
};
const handleMessage = (bytes, uuid) => {
	//we receive bytes as message
	const message = JSON.parse(bytes.toString());
	const user = users[uuid];
	user.state = message;

	broadcast();

	console.log(
		`${user.username} updated their state: ${JSON.stringify(user.state)}`
	);
};
const handleClose = (uuid) => {
	console.log(`${users[uuid].username} disconnected`);
	delete connections[uuid]; // delete keyword to remove the reference
	delete users[uuid];

	broadcast();
};

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
