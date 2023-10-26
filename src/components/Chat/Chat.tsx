import { UiContext } from "@/context/UiContext";
import { useContext, useEffect, useRef, useState } from "react";
import { getAiMessage } from "../../logic/requests";
import "./Chat.css";
import { GameContext } from "@/context/GameContext";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [disableSend, setDisableSend] = useState(false);
  const { uiState, uiDispatch } = useContext(UiContext);
  const { state } = useContext(GameContext);
  const { board, boardHistory } = state;
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    const last3BoardStates = boardHistory.slice(-3);
    if (message.trim()) {
      uiDispatch({
        type: "ADD_CHAT_MESSAGE",
        payload: { content: message, type: "human" },
      });
      setMessage("");
      setDisableSend(true);
      uiDispatch({ type: "SET_LOADING" });
      await getAiMessage(
        message,
        uiState.chatHistory,
        board,
        last3BoardStates,
        uiDispatch
      );
      setDisableSend(false);
      uiDispatch({ type: "CLEAR_LOADING" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disableSend) {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      const { scrollHeight, clientHeight } = chatHistoryRef.current;
      const maxScrollTop = scrollHeight - clientHeight;
      chatHistoryRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [uiState.chatHistory]);

  return (
    <div className="chat-out-container">
      <p className="chat-title">Chat with your AI opponent</p>
      <div className="chat-container">
        <div className="chat-history" ref={chatHistoryRef}>
          {uiState.chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.type === "human" ? "human" : "ai"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {uiState.isLoading && (
            <div className="loading-container">
              <div className="dot-flashing"></div>
            </div>
          )}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default ChatComponent;
