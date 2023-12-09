const status = document.getElementById("status");
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

let ws;

function connectWebSocket() {
    ws = new WebSocket("ws://192.168.0.109:8081");
    ws.onopen = () => {
        setStatus("ONLINE. Событие onopen");
    };

    ws.onclose = () => {
        setStatus("OFFLINE. Событие onclose, переподключение через 5 секунд");
        // Переподключение через 5 секунд
        setTimeout(() => {
            console.log("Попытка переподключения...");
            connectWebSocket();
        }, 5000);
    };

    ws.onmessage = (response) => {
        const data = response.data;

        printMessage(data);
    };
}

function setStatus(value) {
    status.innerHTML = value;
}

function printMessage(value) {
    const li = document.createElement("li");

    li.innerHTML = value;
    messages.appendChild(li);
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = input.value.toString();
    ws.send(data);
    console.log(input.value);

    input.value = "";
});

// Инициализация соединения
connectWebSocket();
