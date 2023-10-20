// src/components/Board/Board.tsx
import React, { use, useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/GameContext";
import {
  IPosition,
  highlightValidSelectedPieceMoves,
} from "../../logic/gameLogic";
import "./Board.css";
import RenderPiece from "./renderPiece";

interface BoardProps {
  handleMove: (from: IPosition, to: IPosition) => void; // Adjusted prop type
}

const Board: React.FC<BoardProps> = ({ handleMove }) => {
  const { state, dispatch } = useContext(GameContext);
  const { board, selectedPiece, currentTurn } = state;
  const [highlightedCells, setHighlightedCells] = useState<string[][]>([]);

  useEffect(() => {
    console.log("State changed: ", state);
  }, [state]);

  const handleSelectPiece = (rowIndex: number, columnIndex: number) => {
    dispatch({
      type: "SELECT_PIECE",
      payload: { row: rowIndex, column: columnIndex },
    });
    const highlighted = highlightValidSelectedPieceMoves(board, {
      row: rowIndex,
      column: columnIndex,
    });
    setHighlightedCells(highlighted);
  };

  const handleMovePiece = (rowIndex: number, columnIndex: number) => {
    handleMove(selectedPiece, { row: rowIndex, column: columnIndex });
    dispatch({ type: "CLEAR_SELECTED_PIECE" });
  };

  const handleEmptyCellClick = () => {
    // Empty Cell: Do nothing for now, but this function can be expanded later if needed
  };

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    setHighlightedCells([]);
    if (currentTurn === "black") return;

    const isOtherPieceFromSamePlayer =
      isPlayerPiece(board, rowIndex, columnIndex) &&
      !isSelected(rowIndex, columnIndex);

    if (selectedPiece && !isEmptyCell(rowIndex, columnIndex)) {
      if (isOtherPieceFromSamePlayer) {
        handleSelectPiece(rowIndex, columnIndex);
        return;
      }
      handleMovePiece(rowIndex, columnIndex);
    } else if (!selectedPiece && isEmptyCell(rowIndex, columnIndex)) {
      handleEmptyCellClick();
    } else if (isOtherPieceFromSamePlayer) {
      handleSelectPiece(rowIndex, columnIndex);
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
        const isHighlighted =
          highlightedCells[rowIndex] &&
          highlightedCells[rowIndex][columnIndex] === "highlighted";

        const backgroundColor = isHighlighted
          ? "green"
          : (isOddRow && isOddCol) || (!isOddRow && !isOddCol)
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
