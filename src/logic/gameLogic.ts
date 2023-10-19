// src/logic/gameLogic.ts

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
  return piece.toLowerCase() === destinationPiece.toLowerCase(); // Compare pieces ignoring case
};

export const isValidMove = (move: IMove, board: string[][]): boolean => {
  if (isFriendlyPiece(move, board)) return false;
  switch (move.piece.toLowerCase()) {
    case "p":
      return isValidPawnMove(move, board);
    case "r":
      return isValidRookMove(move, board);
    case "n":
      return isValidKnightMove(move);
    case "b":
      return isValidBishopMove(move, board);
    case "q":
      return isValidQueenMove(move, board);
    case "k":
      return isValidKingMove(move);
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
      board[to.row][to.column] === ""
    ) {
      // Moving forward two squares on the first move
      return true;
    }
  }

  // Check if capturing
  if (
    Math.abs(from.column - to.column) === 1 &&
    from.row + direction === to.row &&
    board[to.row][to.column] !== ""
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
    return true;
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
    return true;
  }

  return false;
};

const isValidKnightMove = (move: IMove): boolean => {
  const { from, to } = move;
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.column - to.column);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
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

  return true;
};

const isValidQueenMove = (move: IMove, board: string[][]): boolean => {
  return isValidRookMove(move, board) || isValidBishopMove(move, board);
};

const isValidKingMove = (move: IMove): boolean => {
  const { from, to } = move;
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.column - to.column);
  return rowDiff <= 1 && colDiff <= 1;
};
