// src/components/Game/Game.tsx
import React, { useContext } from "react";
import Board from "../Board/Board";
import "./Game.css";
import Log from "../Log/Log";

const Game: React.FC = () => {
  return (
    <div className="game-container">
      <Board />
      <Log />
    </div>
  );
};

export default Game;
