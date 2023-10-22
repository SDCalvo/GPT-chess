import { IPosition } from "./gameLogic";

const columnToLetter = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const formatMove = (from: IPosition, to: IPosition): string => {
  const fromColumnLetter = columnToLetter[from.column];
  const fromRowNumber = 8 - from.row; // Adjust row number to traditional chess notation
  const toColumnLetter = columnToLetter[to.column];
  const toRowNumber = 8 - to.row; // Adjust row number to traditional chess notation
  return `${fromColumnLetter}${fromRowNumber} to ${toColumnLetter}${toRowNumber}`;
};
