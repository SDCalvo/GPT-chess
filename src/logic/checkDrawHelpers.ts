export const insufficientMaterial = (board: string[][]): boolean => {
  let whitePieces = 0;
  let blackPieces = 0;
  let bishopsOrKnights = 0;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (piece) {
        if (piece === piece.toUpperCase()) {
          whitePieces += 1;
        } else {
          blackPieces += 1;
        }

        if (piece.toLowerCase() === "b" || piece.toLowerCase() === "n") {
          bishopsOrKnights += 1;
        }
      }
    }
  }

  // Check for King vs King scenario
  if (whitePieces === 1 && blackPieces === 1) {
    return true;
  }

  // Check for King and Bishop/Knight vs King scenario
  if (
    (whitePieces === 2 && blackPieces === 1) ||
    (whitePieces === 1 && blackPieces === 2)
  ) {
    return bishopsOrKnights === 1;
  }

  return false;
};

export function threefoldRepetition(
  boardHistory: string[][][],
  board: string[][]
): boolean {
  //TODO: Implement this
  return false;
}

export function fiftyMoveRule(
  boardHistory: string[][][],
  board: string[][]
): boolean {
  //TODO: Implement this
  return false;
}
