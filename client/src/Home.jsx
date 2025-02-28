import React from "react";
import useWebSocket from "react-use-websocket";
import { useEffect, useRef } from "react";
import throttle from "lodash.throttle";

import { Cursor } from "./components/Cursor";

const renderCursors = (users) => {
	return Object.keys(users).map((uuid) => {
		const user = users[uuid];

		return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
	});
};

export function Home({ username }) {
	const WS_URL = "ws://localhost:5000"; //connect to server
	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
		queryParams: { username },
	});

	const THROTTLE = 50;
	const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

	useEffect(() => {
		//ask the server to send everyone's state the second we load the component
		sendJsonMessage({
			x: 0,
			y: 0,
		});
		window.addEventListener("mousemove", (e) => {
			sendJsonMessageThrottled.current({
				x: e.clientX,
				y: e.clientY,
			});
		});
	}, []);

	if (lastJsonMessage) {
		return <>{renderCursors(lastJsonMessage)}</>;
	}

	return <h1>Welcome, {username}!</h1>;
}
