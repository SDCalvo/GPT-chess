// src/logic/gameLogic.ts

import {
  isThreatenedByBishop,
  isThreatenedByKing,
  isThreatenedByKnight,
  isThreatenedByPawn,
  isThreatenedByQueen,
  isThreatenedByRook,
} from "./threatened";

export interface IPosition {
  row: number;
  column: number;
}

export interface IMove {
  piece: string;
  from: IPosition;
  to: IPosition;
}

const isFriendlyPiece = (move: IMove, board: string[][]): boolean => {
  const { piece, to } = move;
  const destinationPiece = board[to.row][to.column];
  if (destinationPiece === "") return false; // No piece at destination
  // Checks if both pieces are uppercase or both pieces are lowercase, which would mean they belong to the same player
  return (
    (piece === piece.toUpperCase() &&
      destinationPiece === destinationPiece.toUpperCase()) ||
    (piece === piece.toLowerCase() &&
      destinationPiece === destinationPiece.toLowerCase())
  );
};

export const isValidMove = (move: IMove, board: string[][]): boolean => {
  if (isFriendlyPiece(move, board)) return false;
  switch (move.piece.toLowerCase()) {
    case "p":
      return isValidPawnMove(move, board);
    case "r":
      return isValidRookMove(move, board);
    case "n":
      return isValidKnightMove(move, board);
    case "b":
      return isValidBishopMove(move, board);
    case "q":
      return isValidQueenMove(move, board);
    case "k":
      return isValidKingMove(move, board);
    default:
      return false;
  }
};

const isValidPawnMove = (move: IMove, board: string[][]): boolean => {
  const { from, to } = move;
  const direction = move.piece === "P" ? -1 : 1; // Assuming P is white and p is black
  const startRow = move.piece === "P" ? 6 : 1; // Assuming P is white and p is black

  // Check if moving forward
  if (from.column === to.column) {
    if (from.row + direction === to.row && board[to.row][to.column] === "") {
      // Moving forward one square
      return true;
    } else if (
      from.row === startRow &&
      from.row + 2 * direction === to.row &&
      board[to.row][to.column] === "" &&
      board[from.row + direction][from.column] === ""
    ) {
      // Moving forward two squares on the first move, checking if the path is clear
      return true;
    }
  }

  // Check if capturing
  if (
    Math.abs(from.column - to.column) === 1 &&
    from.row + direction === to.row &&
    board[to.row][to.column] !== "" &&
    !isFriendlyPiece(move, board)
  ) {
    return true;
  }

  return false;
};

const isValidRookMove = (move: IMove, board: string[][]): boolean => {
  const { from, to } = move;

  // Check if moving along a row
  if (from.row === to.row) {
    const columnMin = Math.min(from.column, to.column);
    const columnMax = Math.max(from.column, to.column);
    for (let column = columnMin + 1; column < columnMax; column++) {
      if (board[from.row][column] !== "") {
        // There's a piece in the way
        return false;
      }
    }
    // Check the destination square
    return !isFriendlyPiece(move, board);
  }

  // Check if moving along a column
  if (from.column === to.column) {
    const rowMin = Math.min(from.row, to.row);
    const rowMax = Math.max(from.row, to.row);
    for (let row = rowMin + 1; row < rowMax; row++) {
      if (board[row][from.column] !== "") {
        // There's a piece in the way
        return false;
      }
    }
    // Check the destination square
    return !isFriendlyPiece(move, board);
  }

  return false;
};

const isValidBishopMove = (move: IMove, board: string[][]): boolean => {
  const { from, to } = move;
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.column - to.column);

  if (rowDiff !== colDiff) return false; // not moving diagonally

  const rowStep = from.row < to.row ? 1 : -1;
  const colStep = from.column < to.column ? 1 : -1;
  let row = from.row + rowStep;
  let col = from.column + colStep;

  while (row !== to.row && col !== to.column) {
    if (board[row][col] !== "") return false; // piece in the way
    row += rowStep;
    col += colStep;
  }

  // Check the destination square
  return !isFriendlyPiece(move, board);
};

const isValidKnightMove = (move: IMove, board: string[][]): boolean => {
  const { from, to } = move;
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.column - to.column);
  return (
    ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) &&
    !isFriendlyPiece(move, board)
  );
};

const isValidQueenMove = (move: IMove, board: string[][]): boolean => {
  return (
    (isValidRookMove(move, board) || isValidBishopMove(move, board)) &&
    !isFriendlyPiece(move, board)
  );
};

const isValidKingMove = (move: IMove, board: string[][]): boolean => {
  const { from, to } = move;
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.column - to.column);

  if (rowDiff <= 1 && colDiff <= 1 && !isFriendlyPiece(move, board)) {
    // Create a copy of the board to test the move
    const boardCopy = board.map((row) => row.slice());
    // Move the king to the new position on the copied board
    boardCopy[to.row][to.column] = boardCopy[from.row][from.column];
    boardCopy[from.row][from.column] = "";
    // Check if the king would still be in check after the move
    const player = move.piece === "K" ? "white" : "black";
    return !isKingInCheck(boardCopy, player);
  }

  return false;
};

export const highlightValidSelectedPieceMoves = (
  board: string[][],
  selectedPiece: IPosition
): string[][] => {
  const highlightedBoard = board.map((row) => row.map((cell) => cell));
  const piece = board[selectedPiece.row][selectedPiece.column];
  if (piece === "") return highlightedBoard;
  for (let row = 0; row < highlightedBoard.length; row++) {
    for (let column = 0; column < highlightedBoard[row].length; column++) {
      const move = { piece, from: selectedPiece, to: { row, column } };
      if (isValidMove(move, board)) {
        highlightedBoard[row][column] = "highlighted";
      }
    }
  }
  return highlightedBoard;
};

export const getAllValidMoves = (
  board: string[][],
  player: "white" | "black"
): IMove[] => {
  const validMoves: IMove[] = [];
  const isKingChecked = isKingInCheck(board, player);

  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      const piece = board[row][column];
      if (
        (player === "white" && isUpperCase(piece)) ||
        (player === "black" && !isUpperCase(piece))
      ) {
        const from: IPosition = { row, column };
        for (let targetRow = 0; targetRow < board.length; targetRow++) {
          for (
            let targetColumn = 0;
            targetColumn < board[targetRow].length;
            targetColumn++
          ) {
            const to: IPosition = { row: targetRow, column: targetColumn };
            const move: IMove = { piece, from, to };
            if (isValidMove(move, board)) {
              if (isKingChecked) {
                // Create a copy of the board to test the move
                const boardCopy = board.map((row) => row.slice());
                // Execute the move on the copied board
                boardCopy[to.row][to.column] = boardCopy[from.row][from.column];
                boardCopy[from.row][from.column] = "";
                // Check if the move resolves the check
                if (!isKingInCheck(boardCopy, player)) {
                  validMoves.push(move);
                }
              } else {
                validMoves.push(move);
              }
            }
          }
        }
      }
    }
  }
  return validMoves;
};

export const hasLegalMoves = (
  board: string[][],
  player: "white" | "black"
): boolean => {
  const legalMoves = getAllValidMoves(board, player);
  return legalMoves.length > 0;
};

export const isKingInCheck = (
  board: string[][],
  player: "white" | "black"
): boolean => {
  let kingPosition: IPosition | null = null;
  const opponent = player === "white" ? "black" : "white";

  // Find the king's position
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (
        piece.toLowerCase() === "k" &&
        ((player === "white" && piece === piece.toUpperCase()) ||
          (player === "black" && piece === piece.toLowerCase()))
      ) {
        kingPosition = { row, column: col };
        break;
      }
    }
    if (kingPosition) break;
  }

  if (!kingPosition) {
    console.error("King not found on the board");
    return false; // or throw an error
  }

  // Check threats from each type of opposing piece
  // if (isThreatenedByPawn(board, kingPosition, opponent))
  //   console.log(`--The ${player} king is in check by a pawn`);
  // if (isThreatenedByRook(board, kingPosition, opponent))
  //   console.log(`--The ${player} king is in check by a rook`);
  // if (isThreatenedByKnight(board, kingPosition, opponent))
  //   console.log(`--The ${player} king is in check by a knight`);
  // if (isThreatenedByBishop(board, kingPosition, opponent))
  //   console.log(`--The ${player} king is in check by a bishop`);
  // if (isThreatenedByQueen(board, kingPosition, opponent))
  //   console.log(`--The ${player} king is in check by a queen`);
  // if (isThreatenedByKing(board, kingPosition, opponent))
  //   console.log(`--The ${player} king is in check by a king`);

  return (
    isThreatenedByPawn(board, kingPosition, opponent) ||
    isThreatenedByRook(board, kingPosition, opponent) ||
    isThreatenedByKnight(board, kingPosition, opponent) ||
    isThreatenedByBishop(board, kingPosition, opponent) ||
    isThreatenedByQueen(board, kingPosition, opponent) ||
    isThreatenedByKing(board, kingPosition, opponent)
  );
};

function isUpperCase(char: string) {
  return char === char.toUpperCase() && char !== "";
}
