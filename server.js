const WebSocket = require("ws");
const http = require("http");

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

httpServer.listen(3001, "79.132.139.166", () => {
    console.log(`HTTP-сервер запущен на порту ${httpServer.address().port} `);
});

const server = new WebSocket.Server({ noServer: true }, () => {
    console.log(`Сервер запущен! ${server.address().port}`);
    console.log(`Хост ${server.address().address}`);
});

// Привязываем WebSocket-сервер к HTTP-серверу
server.on("connection", (ws, req) => {
    try {
        console.log("Подключение нового клиента");

        ws.on("message", (message, isBinary) => {
            console.log(`Сообщение от клиента:`);
            console.log(message);

            const isBinaryMessage = isBinary ? "Байтовое сообщение" : "Текстовое сообщение";
            console.log(isBinaryMessage);

            // Отправляем сообщение каждому клиенту
            server.clients.forEach((client) => {
                if (client.isAlive === false) {
                    return ws.terminate();
                }

                const readyState = client.readyState;

                console.log(`Отправка сообщения клиенту`);
                if (readyState === WebSocket.OPEN) {
                    client.send(message, { binary: isBinary });
                }
            });
        });

        ws.on("close", () => {
            console.log("Клиент отключился");
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
