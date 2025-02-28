import React from "react";
import useWebSocket from "react-use-websocket";

export function Home({ username }) {
	const WS_URL = "ws://localhost:5000";
	const x = useWebSocket(WS_URL, {
		queryParams: { username },
	});

	return <h1>Welcome, {username}!</h1>;
}
