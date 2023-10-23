export enum EModels {
  GPT35TURBO = "gpt-3.5-turbo",
  GPT4 = "gpt-4",
}

export interface IGetNextMoveRequest {
  boardState: string[][];
  legalMoves: IMove[];
  model: EModels;
}

interface ChatRequest {
  prompt: string;
  chatHistory: IMessage[];
  currentBoardState: string[][];
  last3BoardStates: string[][][];
  model: EModels;
}

export interface IMessage {
  content: string;
  type: "human" | "ai";
}
