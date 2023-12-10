const status = document.getElementById("status");
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

const getRandomUserId = () => Math.random().toString(36).substr(2, 9); // Генерация случайного userId

const ws = new WebSocket("ws://localhost:3001");

const user = {
    userId: getRandomUserId(),
    roomId: "228",
    roomName: "Room",
};

const room = {
    roomId: "228",
    name: "Room",
    isOpen: true,
};

ws.onopen = () => {
    console.log("onopen", ws.readyState); // 1
    console.log("send", JSON.stringify(user));
    ws.send(
        JSON.stringify({
            userId: user.userId,
            roomId: room.roomId,
            roomName: room.name,
            event: "login", // Отправить на сервер сообщение о входе в систему с соответствующей информацией о чате и информацией о пользователе
        })
    );
};

// Обратный вызов для полученного сообщения
ws.onmessage = (message) => {
    console.log("The client receives the message", message);

    const data = JSON.parse(message.data);
    printMessage(data);
};

// Получение уведомления о разъединении
ws.onclose = () => {
    // Callback to listen for websocket close
    console.log("onclose", ws.readyState);
};

// Ручное отключение соединения websocket
function close() {
    ws && ws.close();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = input.value.trim();
    if (data) {
        if (data === "close") {
            close();
        }

        const message = {
            userId: user.userId,
            roomId: room.roomId,
            roomName: room.name,
            event: "message",
            message: data,
        };

        ws.send(JSON.stringify(message));
        input.value = "";
    }
});

function setStatus(value) {
    status.innerHTML = "Status: " + value;
}

function printMessage(data) {
    const li = document.createElement("li");
    let messageText = "";

    switch (data.event) {
        case "login":
            messageText = `Welcome, пользователь с id ${data.userId}`;
            li.style.color = "green";
            break;
        case "message":
            const isSelf = data.userId === user.userId;
            messageText = `${data.userId}: ${data.message}`;
            li.style.color = isSelf ? "red" : "green";
            break;
        case "logout":
            messageText = `Пользователь с id ${data.userId} вышел из чата`;
            li.style.color = "green";
            break;
        default:
            messageText = data.toString();
            li.style.color = "green";
            break;
    }

    li.textContent = messageText;
    messages.appendChild(li);
}
