// src/components/Game/Game.tsx
import React, { useContext } from "react";
import Board from "../Board/Board";
import "./Game.css";
import Log from "../Log/Log";
import Modal from "../Modals/Modal";
import Chat from "../Chat/Chat";

const Game: React.FC = () => {
  return (
    <div className="game-container">
      <div className="top-container">
        <Board />
        <Log />
      </div>
      <div className="bottom-container">
        <Chat />
      </div>
      <Modal />
    </div>
  );
};

export default Game;
