import React, { useEffect, useState, useRef } from "react";
import apiClient from "../apiClient";
import API from "../API";
import { getFamilyGroupId } from "../utils/familyGroup";
import { useSelector } from "react-redux";

const GroupChatBox = () => {
  const { user } = useSelector((state) => state.userData);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [familyGroupId, setFamilyGroupId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    getFamilyGroupId()
      .then((id) => setFamilyGroupId(id))
      .catch(() => setFamilyGroupId(null));
  }, [userId]);

  useEffect(() => {
    if (!familyGroupId) return;

    const fetchMessages = async () => {
      try {
        const res = await apiClient.get(`${API.FETCH_MESSAGE}/${familyGroupId}`);
        const msgs = res.data.data;
        setMessages(Array.isArray(msgs) ? msgs : []);
      } catch (error) {
        setMessages([]);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [familyGroupId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      await apiClient.post(
        API.SEND_MESSAGE,
        {
          familyGroupId,
          senderId: user._id,
          messageText,
        }
      );
      setMessageText("");
    } catch (error) {
    }
  };

  return (
    <div className="group-chat chat-panel-wrap">
      <div className="group-chat-header">
        <h6 className="mb-0 fw-bold">🟢 Group Chat</h6>
      </div>

      <div className="group-chat-messages">
        {messages.length === 0 ? (
          <p className="text-muted text-center small mt-3">No messages yet. Say hello!</p>
        ) : (
          messages.map((msg) => {
            const isSender =
              msg.senderId === user._id || msg.senderId?._id === user._id;

            return (
              <div
                key={msg._id}
                className={`d-flex mb-2 ${isSender ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className="chat-bubble"
                  style={{
                    backgroundColor: isSender ? "#dcf8c6" : "#fff",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    maxWidth: "85%",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                  }}
                >
                  <small className="text-muted d-block">
                    {isSender ? "You" : msg.senderId?.userName || "Member"}
                  </small>
                  <div style={{ fontSize: "0.95rem" }}>{msg.messageText}</div>
                  <div className="text-end text-muted" style={{ fontSize: "0.7rem" }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="group-chat-input d-flex align-items-center">
        <input
          type="text"
          className="form-control rounded-pill px-3"
          placeholder="Type a message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          type="button"
          className="btn btn-primary ms-2 rounded-pill flex-shrink-0"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChatBox;
