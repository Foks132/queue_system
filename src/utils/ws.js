import { WebSocketServer, WebSocket } from 'ws';
import { AppealService } from "../services/appealService.js";

export function startWebSocketServer(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', function connection(ws) {
        ws.on('message', async function incoming(message) {
            try {
                const { type, data } = JSON.parse(message);

                if (type === 'all') {
                    const result = await AppealService.all(data.status, data.types);
                    ws.send(JSON.stringify({ type: 'all', data: result }));
                }

                if (type === 'create') {
                    const result = await AppealService.create(data);
                    ws.send(JSON.stringify({ type: 'create', data: result }));
                    broadcast(wss, { type: 'newAppeal', data: result });
                }

                if (type === 'accept') {
                    const { userId, appealId } = data;
                    const result = await AppealService.accept(userId, appealId);
                    ws.send(JSON.stringify({ type: 'accept', data: result }));
                    broadcast(wss, { type: 'appealAccepted', data: result });
                }

                if (type === 'close') {
                    const { userId, appealId } = data;
                    const result = await AppealService.close(userId, appealId);
                    ws.send(JSON.stringify({ type: 'close', data: result }));
                    broadcast(wss, { type: 'appealClosed', data: result });
                }
            } catch (e) {
                console.error(e);
                ws.send(JSON.stringify({ type: 'error', message: e.message }));
            }
        });
    });

    console.log('WebSocket server started');
}

const broadcast = (wss, message) => {
    const data = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}
