// src/components/Board/Board.tsx
import React, { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { IPosition } from "../../logic/gameLogic";
import "./Board.css";

interface BoardProps {
  handleMove: (from: IPosition, to: IPosition) => void; // Adjusted prop type
}

const Board: React.FC<BoardProps> = ({ handleMove }) => {
  const { state } = useContext(GameContext);
  const { board } = state;

  const handleCellClick = (row: number, column: number) => {
    const piece = board[row][column];
    if (piece) {
      // Assume `to` position is determined elsewhere for now
      const to: IPosition = { row: row + 1, column }; // Adjusted to position type
      handleMove({ row, column }, to); // Adjusted function call
    }
  };

  return (
    <div className="board">
      {board.flat().map((cell: string, index: number) => {
        const rowIndex = Math.floor(index / 8);
        const columnIndex = index % 8;
        const isOddRow = rowIndex % 2 === 1;
        const isOddCol = columnIndex % 2 === 1;
        const backgroundColor =
          (isOddRow && isOddCol) || (!isOddRow && !isOddCol)
            ? "white"
            : "black";
        return (
          <div
            className="cell"
            key={index}
            onClick={() => handleCellClick(rowIndex, columnIndex)}
            style={{ backgroundColor }}
          >
            {cell}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
