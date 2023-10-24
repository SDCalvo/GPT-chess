import axios from "axios";
import { IMove } from "./gameLogic";

export enum EModels {
  GPT35TURBO = "gpt-3.5-turbo",
  GPT4 = "gpt-4",
}

export interface IMessage {
  content: string;
  type: "human" | "ai";
}

export const getBlackMove = async (
  boardState: string[][],
  legalMoves: IMove[],
  currentTurn: string,
  dispatch: Function
): Promise<IMove | null> => {
  if (currentTurn === "black") {
    try {
      const response = await axios.post("/api/langchain/nextMove", {
        boardState,
        legalMoves,
        model: EModels.GPT35TURBO,
      });
      const move: IMove = response.data;
      dispatch({
        type: "MOVE_PIECE",
        payload: {
          from: { row: move.from.row, column: move.from.column },
          to: { row: move.to.row, column: move.to.column },
        },
      });
      return move; // return the move object
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch the next move");
    }
  }
  return null; // return null if currentTurn is not black
};

export const getAiMessage = async (
  prompt: string,
  chatHistory: IMessage[],
  currentBoardState: string[][],
  last3BoardStates: string[][][],
  dispatch: Function
) => {
  try {
    const response = await axios.post("/api/langchain/getChatMessage", {
      prompt,
      chatHistory,
      currentBoardState,
      last3BoardStates,
      model: EModels.GPT35TURBO,
    });
    const message: string = response.data;
    dispatch({
      type: "ADD_CHAT_MESSAGE",
      payload: { content: message, type: "ai" },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch AI message from function getAiMessage");
  }
};

export const getReaction = async (
  event: string,
  chatHistory: IMessage[],
  currentBoardState: string[][],
  dispatch: Function
) => {
  try {
    const response = await axios.post("/api/langchain/getReaction", {
      event,
      chatHistory,
      currentBoardState,
      model: EModels.GPT35TURBO,
    });
    const message: string = response.data;
    dispatch({
      type: "ADD_CHAT_MESSAGE",
      payload: { content: message, type: "ai" },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch AI message from function getReaction");
  }
};
