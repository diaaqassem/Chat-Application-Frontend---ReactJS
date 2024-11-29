import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./index.css"; //

const socket = io("http://localhost:5001?lang=ar", {
  transports: ["websocket"],
  cors: {
    origin: "http://localhost:3000?lang=ar",
    methods: ["GET", "POST"],
  },
});

const ChatApp = () => {
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("joined_room", (data) => {
      alert(`${data.message || data}`);
      console.log(data);
    });
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data.messageData]);
    });

    socket.on("user_left", (data) => {
      alert(`${data.userID}: ${data.message || data}`);
    });

    socket.on("messages", (data) => {
      setMessages(data.messages || []);
    });
    socket.on("joined_failed", (data) => {
      alert(`${data.message}`);
      // setMessages(data.messages || []);
    });
    socket.on("invalid", (data) => {
      alert(`${data.message || data}`);
      // setMessages(data.messages || []);
    });

    return () => {
      socket.off("joined_room");
      socket.off("receive_message");
      socket.off("user_left");
      socket.off("messages");
    };
  }, []);

  const handleCreateRoom = () => {
    if (roomName.trim() === "") {
      alert("Please enter a room name!");
      return;
    }
    socket.emit("Create_Room", {
      userID: userId,
      name: roomName,
    });
  };

  const handleJoinRoom = () => {
    if (roomId.trim() === "") {
      alert("Please enter a room ID!");
      return;
    }
    socket.emit("Join_Room", {
      userID: userId,
      roomID: roomId,
    });
  };

  const handleLeaveRoom = () => {
    socket.emit("Leave_Room", {
      userID: userId,
      roomID: roomId,
    });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("Send_Message", {
        userID: userId,
        roomID: roomId,
        content: message,
        name: roomName,
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h1>Chat App</h1>
        {/* <h1>Asfour🐱‍🏍</h1> */}
      </div>
      <div className="chat-body">
        <div className="controls">
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Room Name (for Create)"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Room ID (for Join/Leave)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="input-field"
          />
          <button onClick={handleCreateRoom} className="btn create-btn">
            Create Room
          </button>
          <button onClick={handleJoinRoom} className="btn join-btn">
            Join Room
          </button>
          <button onClick={handleLeaveRoom} className="btn leave-btn">
            Leave Room
          </button>
        </div>

        <div className="messages-section">
          <h2>Messages</h2>
          <div className="messages">
            {/* {messages.map((msg, idx) => (
              <p key={idx} className="message">
                {msg}
              </p>
            ))} */}

            {messages.map((msg, idx) => (
              <p key={idx + msg} className="message">
                {/* <span>
                  {msg.time}
                  {":\n"}
                </span> */}
                {msg}
              </p>
            ))}
          </div>
          <div className="send-message">
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field"
            />
            <button onClick={handleSendMessage} className="btn send-btn">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
