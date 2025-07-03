import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import API from "../API";
import { useSelector } from "react-redux";

const GroupChatBox = () => {
  const { token, user } = useSelector((state) => state.userData);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [familyGroupId, setFamilyGroupId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const getFamilyGroup = async () => {
      try {
        const res = await axios.get(API.GET_FAMILY, {
          headers: { Authorization: token },
        });
        setFamilyGroupId(res.data.family._id);
      } catch (error) {
        console.error("Failed to get family group:", error);
      }
    };

    getFamilyGroup();
  }, [token]);

  useEffect(() => {
    if (!familyGroupId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API.FETCH_MESSAGE}/${familyGroupId}`, {
          headers: { Authorization: token },
        });

        const msgs = res.data.data;
        console.log("Fetched messages:", res.data);
        setMessages(Array.isArray(msgs) ? msgs : []); // ✅ force to array
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]); // fallback to empty array on error
      }
    };


    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [familyGroupId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      await axios.post(
        API.SEND_MESSAGE,
        {
          familyGroupId,
          senderId: user._id,
          messageText,
        },
        {
          headers: { Authorization: token },
        }
      );
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#efeae2",
        borderLeft: "1px solid #ddd",
      }}
    >
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-between px-4 py-2"
        style={{ backgroundColor: "#f0f2f5", borderBottom: "1px solid #ccc" }}
      >
        <h6 className="mb-0 fw-bold">🟢 Group Chat</h6>
      </div>

      {/* Chat body */}
      <div
        className="flex-grow-1 p-3"
        style={{
          overflowY: "auto",
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/cubes.png')",
          backgroundSize: "cover",
        }}
      >
        {messages.map((msg) => {
          const isSender =
            msg.senderId === user._id || msg.senderId?._id === user._id;

          return (
            <div
              key={msg._id}
              className={`d-flex mb-2 ${isSender ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                style={{
                  backgroundColor: isSender ? "#dcf8c6" : "#fff",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  maxWidth: "75%",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                }}
              >
                <small className="text-muted">
                  {isSender ? "You" : msg.senderId?.userName || "Member"}

                </small>

                <div style={{ fontSize: "0.95rem" }}>{msg.messageText}</div>
                <div
                  className="text-end text-muted"
                  style={{ fontSize: "0.7rem", marginTop: "2px" }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="d-flex p-3 bg-white border-top">
        <input
          type="text"
          className="form-control rounded-pill px-3"
          placeholder="Type a message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="btn btn-primary ms-2 px-4 rounded-pill"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChatBox;
