const WebSocket = require("ws");
const http = require("http");

const group = {};
const heartBeatTime = 50000;

// Создаем HTTP-сервер
const httpServer = http.createServer((req, res) => {
    if (req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Connect есть)\n");
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found\n");
    }
});

httpServer.listen(3001, "localhost", () => {
    console.log(`HTTP-сервер запущен на порту ${httpServer.address().port} `);
});

const server = new WebSocket.Server({ noServer: true }, () => {
    console.log(`Сервер запущен! ${server.address().port}`);
    console.log(`Хост ${server.address().address}`);
});

server.on("connection", (ws, req) => {
    try {
        ws.on("message", (message, isBinary) => {
            const messageToString = message.toString();

            console.log("server receive message: ", messageToString);
            const data = JSON.parse(messageToString);

            if (data.event === "login") {
                ws.enterInfo = data;
            }

            if (typeof ws.roomId === "undefined" && data.roomId) {
                ws.roomId = data.roomId;
                if (typeof group[ws.roomId] === "undefined") {
                    group[ws.roomId] = 1;
                } else {
                    group[ws.roomId]++;
                }
            }

            data.num = group[ws.roomId];
            server.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN && client.roomId === ws.roomId) {
                    client.send(JSON.stringify(data));
                }
            });

            // // Отправляем сообщение каждому клиенту
            // server.clients.forEach((client) => {
            //     if (client.isAlive === false) {
            //         return ws.terminate();
            //     }

            //     const readyState = client.readyState;

            //     console.log(`Отправка сообщения клиенту`);
            //     if (readyState === WebSocket.OPEN) {
            //         client.send(message, { binary: isBinary });
            //     }
            // });
        });

        ws.on("close", () => {
            console.log("Клиент отключился");

            group[ws.roomId]--;

            server.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN && client.roomId === ws.roomId) {
                    client.send(
                        JSON.stringify({
                            ...ws.enterInfo,
                            event: "logout",
                            num: group[ws.roomId],
                        })
                    );
                }
            });
        });

        ws.on("error", (error) => {
            console.log(error);
        });

        ws.send("Добро пожаловать в мой чат!");
    } catch (error) {
        console.log(error);
    }
});

// Привязываем WebSocket-сервер к HTTP-серверу
httpServer.on("upgrade", (request, socket, head) => {
    server.handleUpgrade(request, socket, head, (ws) => {
        server.emit("connection", ws, request);
    });
});
