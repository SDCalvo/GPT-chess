export enum EModels {
  GPT35TURBO = "gpt-3.5-turbo",
  GPT4 = "gpt-4",
}

export interface IGetNextMoveRequest {
  boardState: string[][];
  legalMoves: IMove[];
  model: EModels;
}
