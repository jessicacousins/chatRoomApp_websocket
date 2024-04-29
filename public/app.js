document.addEventListener("DOMContentLoaded", () => {
  const formJoin = document.querySelector(".form-join");
  if (formJoin) {
    formJoin.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const room = document.getElementById("room").value.trim();
      if (name && room) {
        window.location.href = `chatroom.html?name=${encodeURIComponent(
          name
        )}&room=${encodeURIComponent(room)}`;
      }
    });
  }

  if (window.location.pathname.includes("chatroom.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("name");
    const room = urlParams.get("room");

    const socket = io("http://localhost:3500", {
      query: { name, room },
    });

    socket.on("connect", () => {
      socket.emit("joinRoom", { name, room });
    });

    const chatDisplay = document.querySelector(".chat-display");

    socket.on("message", (data) => {
      const { name, text, color } = data;
      const messageElement = document.createElement("li");
      messageElement.style.color = color;
      messageElement.textContent = `${name}: ${text}`;
      chatDisplay.appendChild(messageElement);
      chatDisplay.scrollTop = chatDisplay.scrollHeight;
    });

    const messageForm = document.querySelector(".form-msg");
    if (messageForm) {
      messageForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const message = document.getElementById("message").value.trim();
        if (message) {
          socket.emit("sendMessage", { message, name, room });
          document.getElementById("message").value = "";
        }
      });
    }
  }
});
