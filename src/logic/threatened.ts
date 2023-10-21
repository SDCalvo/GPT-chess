import { IPosition } from "./gameLogic";

export const isThreatenedByPawn = (
  board: string[][],
  position: IPosition,
  opponent: "white" | "black"
): boolean => {
  const { row, column } = position;
  const direction = opponent === "white" ? 1 : -1;

  const leftThreatPosition = { row: row + direction, column: column - 1 };

  if (
    leftThreatPosition.row >= 0 &&
    leftThreatPosition.row < board.length &&
    leftThreatPosition.column >= 0 &&
    leftThreatPosition.column < board[0].length
  ) {
    const leftThreatPiece =
      board[leftThreatPosition.row][leftThreatPosition.column];
    if (
      leftThreatPiece.toLowerCase() === "p" &&
      ((opponent === "white" &&
        leftThreatPiece === leftThreatPiece.toUpperCase()) ||
        (opponent === "black" &&
          leftThreatPiece === leftThreatPiece.toLowerCase()))
    ) {
      return true;
    }
  }

  const rightThreatPosition = { row: row + direction, column: column + 1 };

  if (
    rightThreatPosition.row >= 0 &&
    rightThreatPosition.row < board.length &&
    rightThreatPosition.column >= 0 &&
    rightThreatPosition.column < board[0].length
  ) {
    const rightThreatPiece =
      board[rightThreatPosition.row][rightThreatPosition.column];
    if (
      rightThreatPiece.toLowerCase() === "p" &&
      ((opponent === "white" &&
        rightThreatPiece === rightThreatPiece.toUpperCase()) ||
        (opponent === "black" &&
          rightThreatPiece === rightThreatPiece.toLowerCase()))
    ) {
      return true;
    }
  }

  return false;
};

export const isThreatenedByKnight = (
  board: string[][],
  position: IPosition,
  opponent: "white" | "black"
): boolean => {
  const { row, column } = position;
  const directions = [
    { row: row - 2, column: column - 1 },
    { row: row - 2, column: column + 1 },
    { row: row - 1, column: column - 2 },
    { row: row - 1, column: column + 2 },
    { row: row + 1, column: column - 2 },
    { row: row + 1, column: column + 2 },
    { row: row + 2, column: column - 1 },
    { row: row + 2, column: column + 1 },
  ];

  for (const direction of directions) {
    if (
      direction.row >= 0 &&
      direction.row < board.length &&
      direction.column >= 0 &&
      direction.column < board[0].length
    ) {
      const piece = board[direction.row][direction.column];
      if (
        piece.toLowerCase() === "n" &&
        ((opponent === "white" && piece === piece.toUpperCase()) ||
          (opponent === "black" && piece === piece.toLowerCase()))
      ) {
        return true;
      }
    }
  }

  return false;
};

export const isThreatenedByBishop = (
  board: string[][],
  position: IPosition,
  opponent: "white" | "black"
): boolean => {
  const { row: startPosRow, column: startPosColumn } = position;
  const directions = [
    { rowOffset: -1, columnOffset: -1 },
    { rowOffset: -1, columnOffset: 1 },
    { rowOffset: 1, columnOffset: -1 },
    { rowOffset: 1, columnOffset: 1 },
  ];

  for (const direction of directions) {
    let row = startPosRow + direction.rowOffset;
    let column = startPosColumn + direction.columnOffset;
    while (
      row >= 0 &&
      row < board.length &&
      column >= 0 &&
      column < board[0].length
    ) {
      const piece = board[row][column];
      if (piece !== "") {
        if (
          (piece.toLowerCase() === "b" || piece.toLowerCase() === "q") &&
          ((opponent === "white" && piece === piece.toUpperCase()) ||
            (opponent === "black" && piece === piece.toLowerCase()))
        ) {
          return true;
        }
        break;
      }
      row += direction.rowOffset;
      column += direction.columnOffset;
    }
  }

  return false;
};

export const isThreatenedByRook = (
  board: string[][],
  position: IPosition,
  opponent: "white" | "black"
): boolean => {
  const { row: startPosRow, column: startPosColumn } = position;
  const directions = [
    { rowOffset: -1, columnOffset: 0 },
    { rowOffset: 1, columnOffset: 0 },
    { rowOffset: 0, columnOffset: -1 },
    { rowOffset: 0, columnOffset: 1 },
  ];

  for (const direction of directions) {
    let row = startPosRow + direction.rowOffset;
    let column = startPosColumn + direction.columnOffset;
    while (
      row >= 0 &&
      row < board.length &&
      column >= 0 &&
      column < board[0].length
    ) {
      const piece = board[row][column];
      if (piece !== "") {
        if (
          (piece.toLowerCase() === "r" || piece.toLowerCase() === "q") &&
          ((opponent === "white" && piece === piece.toUpperCase()) ||
            (opponent === "black" && piece === piece.toLowerCase()))
        ) {
          return true;
        }
        break;
      }
      row += direction.rowOffset;
      column += direction.columnOffset;
    }
  }

  return false;
};

export const isThreatenedByQueen = (
  board: string[][],
  position: IPosition,
  opponent: "white" | "black"
): boolean => {
  return (
    isThreatenedByBishop(board, position, opponent) ||
    isThreatenedByRook(board, position, opponent)
  );
};

export const isThreatenedByKing = (
  board: string[][],
  position: IPosition,
  opponent: "white" | "black"
): boolean => {
  const { row, column } = position;
  const directions = [
    { rowOffset: -1, columnOffset: -1 },
    { rowOffset: -1, columnOffset: 0 },
    { rowOffset: -1, columnOffset: 1 },
    { rowOffset: 0, columnOffset: -1 },
    { rowOffset: 0, columnOffset: 1 },
    { rowOffset: 1, columnOffset: -1 },
    { rowOffset: 1, columnOffset: 0 },
    { rowOffset: 1, columnOffset: 1 },
  ];

  for (const direction of directions) {
    const newRow = row + direction.rowOffset;
    const newColumn = column + direction.columnOffset;
    if (
      newRow >= 0 &&
      newRow < board.length &&
      newColumn >= 0 &&
      newColumn < board[0].length
    ) {
      const piece = board[newRow][newColumn];
      if (
        piece.toLowerCase() === "k" &&
        ((opponent === "white" && piece === piece.toUpperCase()) ||
          (opponent === "black" && piece === piece.toLowerCase()))
      ) {
        return true;
      }
    }
  }

  return false;
};
