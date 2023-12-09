// const status = document.getElementById("status");
// const messages = document.getElementById("messages");
// const form = document.getElementById("form");
// const input = document.getElementById("input");

// let ws;

// function connectWebSocket() {
//     ws = new WebSocket("ws://79.132.139.166:3001");
//     ws.onopen = () => {
//         ws.send("Message"); // Исправление здесь
//         setStatus("ONLINE. Событие onopen");
//     };

//     ws.onclose = () => {
//         setStatus("OFFLINE. Событие onclose, переподключение через 5 секунд");
//         // Переподключение через 5 секунд
//         setTimeout(() => {
//             console.log("Попытка переподключения...");

//             connectWebSocket();
//         }, 5000);
//     };

//     ws.onmessage = (response) => {
//         const data = response.data;
//         printMessage(data);
//     };

//     ws.onerror = (error) => {
//         setStatus("ERROR. Событие onerror");
//         console.log(error);
//     };
// }

// function setStatus(value) {
//     status.innerHTML = value;
// }

// function printMessage(value) {
//     const li = document.createElement("li");
//     li.innerHTML = value;
//     messages.appendChild(li);
// }

// form.addEventListener("submit", (event) => {
//     event.preventDefault();

//     if (ws.readyState === WebSocket.OPEN) {
//         const data = input.value.toString();
//         ws.send(data);
//         console.log(input.value);
//         input.value = "";
//     } else {
//         console.log("Соединение еще не установлено. Пожалуйста, подождите.");
//     }
// });

// // Инициализация соединения
// connectWebSocket();

const status = document.getElementById("status");
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

const ws = new WebSocket("ws://79.132.139.166:3001");

ws.addEventListener("open", () => {
    setStatus("Connected");
});

ws.addEventListener("message", (event) => {
    printMessage(event.data);
});

ws.addEventListener("close", () => {
    setStatus("Connection closed");
});

ws.addEventListener("error", (error) => {
    setStatus("Error: " + error.message);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = input.value.trim();
    if (data) {
        ws.send(data);
        input.value = "";
    }
});

function setStatus(value) {
    status.innerHTML = "Status: " + value;
}

function printMessage(value) {
    const li = document.createElement("li");
    li.textContent = value;
    messages.appendChild(li);
}
