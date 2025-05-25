import env from "../env";
const reconnectInterval = 3000;

let isReconnecting = true; // Control variable for reconnection

export const stopWebSocketReconnection = () => {
    isReconnecting = false;
}

export const connectWebSocket = (socketRef, onConnect, onDisconnect, onMessage, getUsernameOnce) => {
    const socket = socketRef.current;

    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        return;
    }

    const newSocket = new WebSocket(`${env.WS_URL}`);
    socketRef.current = newSocket;

    newSocket.onopen = () => {
        const username = getUsernameOnce?.();
        if (username) {
            newSocket.send(JSON.stringify({ type: "userData", username }));
        }

        onConnect?.();
    }

    newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage?.(data);
    }

    newSocket.onclose = (event) => {
        onDisconnect?.();

        if (isReconnecting) {
            setTimeout(() => {
                connectWebSocket(socketRef, onConnect, onDisconnect, onMessage, getUsernameOnce);
            }, reconnectInterval);
        }
    }
}