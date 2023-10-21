// src/components/Game/Game.tsx
import React, { useContext } from "react";
import Board from "../Board/Board"; // Import the Board component // Import necessary types and functions
import "./Game.css";

const Game: React.FC = () => {
  return (
    <div className="game-container">
      <Board />
    </div>
  );
};

export default Game;
