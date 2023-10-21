// src/components/Board/Board.tsx
import React, { use, useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/GameContext";
import {
  IMove,
  IPosition,
  highlightValidSelectedPieceMoves,
  isValidMove,
} from "../../logic/gameLogic";
import "./Board.css";
import RenderPiece from "./renderPiece";

const Board: React.FC = () => {
  const { state, dispatch } = useContext(GameContext);
  const { board, selectedPiece, currentTurn } = state;
  const [highlightedCells, setHighlightedCells] = useState<string[][]>([]);

  useEffect(() => {
    console.log("State changed: ", state);
  }, [state]);

  const handleSelectPiece = (rowIndex: number, columnIndex: number) => {
    if (!isPlayerPiece(board, rowIndex, columnIndex)) {
      console.error("Invalid selection: not a friendly piece or empty cell");
      return;
    }
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
    console.log("handleMovePiece");
    const from = { row: selectedPiece.row, column: selectedPiece.column };
    const to = { row: rowIndex, column: columnIndex };
    const piece = board[from.row][from.column];
    const move: IMove = { piece, from, to };

    // Check if the move is valid
    if (!isValidMove(move, board)) {
      console.error("Invalid move");
      return;
    }

    const destinationCell = board[rowIndex][columnIndex];
    const actionType = destinationCell === "" ? "MOVE_PIECE" : "CAPTURE_PIECE";

    dispatch({
      type: actionType,
      payload: {
        from: selectedPiece,
        to: { row: rowIndex, column: columnIndex },
      },
    });
    dispatch({ type: "CLEAR_SELECTED_PIECE" });
  };

  const handleEmptyCellClick = () => {
    // Empty Cell: Do nothing for now, but this function can be expanded later if needed
  };

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    if (currentTurn === "black") return;

    const isOtherPieceFromSamePlayer =
      isPlayerPiece(board, rowIndex, columnIndex) &&
      !isSelected(rowIndex, columnIndex);

    if (selectedPiece) {
      if (!isEmptyCell(rowIndex, columnIndex)) {
        if (isOtherPieceFromSamePlayer) {
          handleSelectPiece(rowIndex, columnIndex);
          return;
        }
        handleMovePiece(rowIndex, columnIndex);
      } else {
        // The cell is empty, and there's a selected piece, so we attempt to move the piece to this location.
        handleMovePiece(rowIndex, columnIndex);
      }
      // Re-calculate and re-render the valid moves for the selected piece after attempting a move.
      const highlighted = highlightValidSelectedPieceMoves(
        board,
        selectedPiece
      );
      setHighlightedCells(highlighted);
    } else if (!selectedPiece && isOtherPieceFromSamePlayer) {
      // No piece is selected, and the cell clicked on has a friendly piece, so we select it.
      handleSelectPiece(rowIndex, columnIndex);
    } else {
      // No piece is selected, and the cell clicked on is empty or has an enemy piece.
      handleEmptyCellClick();
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

  useEffect(() => {
    if (!selectedPiece) {
      console.log("clearing highlighted cells due to selectedPiece change");
      setHighlightedCells([]);
    }
  }, [selectedPiece]);

  // Debug event listener to change turn when pressing key "U"
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "u") {
        dispatch({ type: "CHANGE_TURN" });
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [dispatch]);

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
