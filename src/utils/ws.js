import { WebSocketServer, WebSocket } from 'ws';
import { AppealService } from "../services/appealService.js";

export function startWebSocketServer(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', function connection(ws) {
        ws.on('message', async function incoming(message) {
            try {
                const { action, data } = JSON.parse(message);

                if (action === 'all') {
                    const result = await AppealService.all(data.status, data.types);
                    ws.send(JSON.stringify({ action: 'all', data: result }));
                }

                if (action === 'create') {
                    const result = await AppealService.create(data);
                    ws.send(JSON.stringify({ action: 'create', data: result }));
                    broadcast(wss, { action: 'newAppeal', data: result });
                }

                if (action === 'accept') {
                    const { userId, appealId } = data;
                    const result = await AppealService.accept(userId, appealId);
                    ws.send(JSON.stringify({ action: 'accept', data: result }));
                    broadcast(wss, { action: 'appealAccepted', data: result });
                }

                if (action === 'close') {
                    const { userId, appealId } = data;
                    const result = await AppealService.close(userId, appealId);
                    ws.send(JSON.stringify({ action: 'close', data: result }));
                    broadcast(wss, { action: 'appealClosed', data: result });
                }
            } catch (e) {
                console.error(e);
                ws.send(JSON.stringify({ action: 'error', message: e.message }));
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
