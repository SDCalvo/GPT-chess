// src/components/Board/Board.tsx
import React, {
  use,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { EGameStatus, GameContext } from "../../context/GameContext";
import {
  IMove,
  IPosition,
  hasLegalMoves,
  highlightValidSelectedPieceMoves,
  isKingInCheck,
  isValidMove,
} from "../../logic/gameLogic";
import "./Board.css";
import RenderPiece from "./renderPiece";
import {
  fiftyMoveRule,
  insufficientMaterial,
  threefoldRepetition,
} from "@/logic/checkDrawHelpers";
import { fetchBlackMove } from "@/logic/requests";
import { formatMove } from "@/logic/helpers";
import { UiContext } from "@/context/UiContext";

const Board: React.FC = () => {
  const { state, dispatch } = useContext(GameContext);
  const { board, selectedPiece, currentTurn } = state;
  const { uiState, uiDispatch } = useContext(UiContext);
  const [highlightedCells, setHighlightedCells] = useState<string[][]>([]);

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
    logMove(from, to);
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

  const checkGameStatus = useCallback(
    (board: string[][], currentTurn: "white" | "black") => {
      const opponent = currentTurn === "white" ? "black" : "white";

      // Check for checkmate or stalemate
      if (isKingInCheck(board, opponent)) {
        if (!hasLegalMoves(board, opponent)) {
          console.log("-----------------------------------------------------");
          console.log(`${currentTurn} wins by checkmate!`);
          console.log("-----------------------------------------------------");
          dispatch({
            type: EGameStatus.Checkmate,
            payload: { winner: currentTurn },
          });
        }
      } else if (!hasLegalMoves(board, opponent)) {
        console.log("-----------------------------------------------------");
        console.log("The game is a stalemate!");
        console.log("-----------------------------------------------------");
        dispatch({ type: EGameStatus.Stalemate });
      }

      // Check for insufficient material
      if (insufficientMaterial(board)) {
        console.log("-----------------------------------------------------");
        console.log("The game is a draw due to insufficient material!");
        console.log("-----------------------------------------------------");
        dispatch({ type: EGameStatus.Draw });
      }
      //---------------------------------------------------------------- To implement later
      // Check for threefold repetition
      // if (threefoldRepetition(, board)) {
      //   console.log("The game is a draw due to threefold repetition!");
      //   dispatch({ type: EGameStatus.Draw });
      // }

      // Check for fifty-move rule
      // if (fiftyMoveRule(board)) {
      //   console.log("The game is a draw due to the fifty-move rule!");
      //   dispatch({ type: EGameStatus.Draw });
      // }
    },
    [dispatch] // dispatch is the dependency here, assuming it's coming from a useContext hook or similar
  );

  const logMove = (from: IPosition, to: IPosition) => {
    const piece = board[from.row][from.column];
    const move = formatMove(from, to);
    console.log(`log move from ui context: ${move}`);
    uiDispatch({
      type: "LOG_MOVE",
      payload: {
        move,
        player: currentTurn,
        piece,
      },
    });
  };
  // Call checkGameStatus function after each move
  useEffect(() => {
    checkGameStatus(board, currentTurn);
  }, [board, currentTurn, checkGameStatus]);

  useEffect(() => {
    if (!selectedPiece) {
      setHighlightedCells([]);
    }
  }, [selectedPiece]);

  // Debug event listener to change turn when pressing key "U"
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "u") {
        dispatch({ type: "CHANGE_TURN" });
        uiDispatch({ type: "CHANGE_TURN" });
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [dispatch]);

  useEffect(() => {
    const makeBlackMove = async () => {
      if (currentTurn === "black") {
        const move = await fetchBlackMove();
        dispatch({ type: EGameStatus.Black_Moves, payload: move });
      }
    };
    makeBlackMove();
  }, [currentTurn, dispatch]);

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
