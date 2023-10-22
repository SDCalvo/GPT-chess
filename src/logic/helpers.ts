import { IPosition } from "./gameLogic";

const columnToLetter = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const formatMove = (from: IPosition, to: IPosition): string => {
  const fromColumnLetter = columnToLetter[from.column];
  const fromRowNumber = 8 - from.row; // Adjust row number to traditional chess notation
  const toColumnLetter = columnToLetter[to.column];
  const toRowNumber = 8 - to.row; // Adjust row number to traditional chess notation
  return `${fromColumnLetter}${fromRowNumber} to ${toColumnLetter}${toRowNumber}`;
};

export const formatTile = (position: IPosition): string => {
  const columnLetter = columnToLetter[position.column];
  const rowNumber = 8 - position.row; // Adjust row number to traditional chess notation
  return `${columnLetter}${rowNumber}`;
};
