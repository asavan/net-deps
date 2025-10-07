import { WebSocketServer, WebSocket } from "ws";

const onConnection = (clients) => (ws, req) => {
    // https://stackoverflow.com/questions/14822708/
    // how-to-get-client-ip-address-with-websocket-websockets-ws-library-in-node-js
    console.log("WS connection established!",
        req.socket.remoteAddress,
        req.headers["sec-websocket-key"]);

    ws.on("close", () => {
        console.log("WS closed!");
    });

    ws.on("message", (message) => {
        console.log("Got ws message: " + message);
        for (const candidate of clients) {
            // send to everybody on the site, except sender
            if (candidate !== ws && candidate.readyState === WebSocket.OPEN) {
                // console.log("Send ws message: " + message);
                candidate.send(message);
            }
        }
    });
};

export default function wsServer(port) {
    const wss = new WebSocketServer({port: port});
    wss.on("connection", onConnection(wss.clients));
}
