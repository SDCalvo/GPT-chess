// src/components/Game/Game.tsx
import React, { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import Board from "../Board/Board"; // Import the Board component
import { IPosition, IMove, isValidMove } from "../../logic/gameLogic"; // Import necessary types and functions
import "./Game.css";

const Game: React.FC = () => {
  const { state, dispatch } = useContext(GameContext);
  const { board, currentTurn } = state;

  const handlePieceMove = (from: IPosition, to: IPosition) => {
    const move: IMove = { piece: board[from.row][from.column], from, to };
    if (isValidMove(move, board)) {
      dispatch({ type: "MOVE_PIECE", payload: move });
      const capturingPiece = board[from.row][from.column];
      const capturedPiece = board[to.row][to.column];
      if (
        capturedPiece !== "" &&
        isUpperCase(capturingPiece) !== isUpperCase(capturedPiece) // Ensure pieces belong to different players
      ) {
        dispatch({
          type: "CAPTURE_PIECE",
          payload: { capturingPiecePos: from, capturedPiecePos: to },
        });
      }
      dispatch({ type: "CHANGE_TURN" });
      dispatch({ type: "CLEAR_SELECTED_PIECE" });
    }
  };

  const isUpperCase = (char: string) => char === char.toUpperCase();

  return (
    <div className="game-container">
      <Board handleMove={handlePieceMove} />
    </div>
  );
};

export default Game;
