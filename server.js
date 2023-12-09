const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8081 });

server.on("connection", (ws, req) => {
    try {
        console.log("Подключение новог клиента");

        ws.on("message", (message, isBinary) => {
            console.log(`Сообщение из клиента:`);
            console.log(message);

            const isBinaryMessage = isBinary ? "Байтовое сообщение" : "Текстовое сообщение";
            console.log(isBinaryMessage);

            const clients = server.clients;

            clients.forEach((client) => {
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

        ws.send("Добро пожаловать в мой чат!");
    } catch (error) {
        console.log(error);
    }
});

console.log(`Сервер запущен! ${server.address().port}`);
