import axios from "axios";
import { IMove } from "./gameLogic";

export enum EModels {
  GPT35TURBO = "gpt-3.5-turbo",
  GPT4 = "gpt-4",
}

export const getBlackMove = async (
  boardState: string[][],
  legalMoves: IMove[],
  currentTurn: string,
  dispatch: Function
) => {
  if (currentTurn === "black") {
    try {
      const response = await axios.post("/api/langchain/nextMove", {
        boardState,
        legalMoves,
        model: EModels.GPT35TURBO, // or whichever model you choose to use
      });
      const move: IMove = response.data;
      dispatch({
        type: "MOVE_PIECE",
        payload: {
          from: { row: move.from.row, column: move.from.column },
          to: { row: move.to.row, column: move.to.column },
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch the next move");
    }
  }
};
