// src/components/Board/Board.tsx
import React, { use, useContext, useEffect } from "react";
import { GameContext } from "../../context/GameContext";
import { IPosition } from "../../logic/gameLogic";
import "./Board.css";
import RenderPiece from "./renderPiece";

interface BoardProps {
  handleMove: (from: IPosition, to: IPosition) => void; // Adjusted prop type
}

const Board: React.FC<BoardProps> = ({ handleMove }) => {
  const { state, dispatch } = useContext(GameContext);
  const { board, selectedPiece, currentTurn } = state;

  useEffect(() => {
    console.log("State changed: ", state);
  }, [state]);

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    if (currentTurn === "black") return;
    if (selectedPiece && isEmptyCell(rowIndex, columnIndex)) {
      // Second Click: Attempt to move the piece

      handleMove(selectedPiece, { row: rowIndex, column: columnIndex });
      dispatch({ type: "CLEAR_SELECTED_PIECE" }); // Clear the selected piece
    } else if (!selectedPiece && isEmptyCell(rowIndex, columnIndex)) {
      // Empty Cell: Do nothing
    } else if (
      isPlayerPiece(board, rowIndex, columnIndex) &&
      !selectedPiece &&
      !isEmptyCell(rowIndex, columnIndex)
    ) {
      // First Click: Select the piece
      dispatch({
        type: "SELECT_PIECE",
        payload: { row: rowIndex, column: columnIndex },
      });
    }
  };

  function isEmptyCell(row: number, col: number) {
    return board[row][col] === "";
  }

  function isPlayerPiece(board: string[][], row: number, col: number) {
    const piece = board[row][col];
    return (
      (isUpperCase(piece) && currentTurn === "white") ||
      (!isUpperCase(piece) && currentTurn === "black")
    );
  }

  function isUpperCase(char: string) {
    return char === char.toUpperCase();
  }

  function isSelected(row: number, col: number) {
    return (
      selectedPiece && selectedPiece.row === row && selectedPiece.column === col
    );
  }

  return (
    <div className="board">
      {board.flat().map((cell: string, index: number) => {
        const rowIndex = Math.floor(index / 8);
        const columnIndex = index % 8;
        const isOddRow = rowIndex % 2 === 1;
        const isOddCol = columnIndex % 2 === 1;
        const backgroundColor =
          (isOddRow && isOddCol) || (!isOddRow && !isOddCol)
            ? "#F7DCB4"
            : "#8B4513";
        return (
          <div
            className={`cell ${
              isSelected(rowIndex, columnIndex) ? "selected" : ""
            }`}
            key={index}
            onClick={() => handleCellClick(rowIndex, columnIndex)}
            style={{ backgroundColor }}
          >
            {RenderPiece(cell)}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
