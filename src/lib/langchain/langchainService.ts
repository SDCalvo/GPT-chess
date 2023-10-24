import { EModels, IMessage } from "@/backend-types/langchain/langchainTypes";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseMessageLike } from "langchain/schema";
import { prompts, parsers } from "@/lib/langchain/promptsAndParsers";
import { IMove } from "@/logic/gameLogic";

class LangchainService {
  private model: EModels;

  constructor(model: EModels) {
    this.model = model;
  }

  getOpenAiClient = (): ChatOpenAI => {
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPEN_AI_KEY as string,
      modelName: this.model,
    });
    return chat;
  };

  getGptResponse = async (prompt: string): Promise<string> => {
    const chat = this.getOpenAiClient();
    // Base message like type type BaseMessageLike = string | BaseMessage | ["user" | MessageType | "assistant" | (string & Record<never, never>), string]
    const message: BaseMessageLike = ["human", prompt];
    const response = await chat.call(message);
    return response?.content;
  };

  getNextAiMove = async (
    boardState: string[][],
    legalMoves: IMove[]
  ): Promise<IMove> => {
    const legalMovesAsString = legalMoves.map((move) => JSON.stringify(move));
    const boardStateWithDotsInseadOfEmptySpaces = boardState
      .map((row) => row.join(""))
      .join("\n")
      .replace(/ /g, ".");
    const prompt = prompts.GET_NEXT_MOVE.replace(
      "{{BOARD_STATE}}",
      boardStateWithDotsInseadOfEmptySpaces
    ).replace("{{LEGAL_MOVES}}", legalMovesAsString.join("\n"));
    const response = await this.getGptResponse(prompt);
    return parsers.GET_NEXT_MOVE(response, legalMoves);
  };

  getChatResponse = async (
    prompt: string,
    chatHistory: IMessage[],
    currentBoardState: string[][],
    last3BoardStates: string[][][]
  ): Promise<string> => {
    const chat = this.getOpenAiClient();
    const last3Moves = last3BoardStates
      .map((boardState) => boardState.map((row) => row.join("")).join("\n"))
      .join("\n");
    const chatHistoryString = chatHistory
      .map((message) => message.content)
      .join("\n");
    const promptWithReplacements = prompts.GET_CHAT_RESPONSE.replace(
      "{{BOARD_STATE}}",
      currentBoardState.map((row) => row.join("")).join("\n")
    )
      .replace("{{LAST_3_MOVES}}", last3Moves)
      .replace("{{CHAT_HISTORY}}", chatHistoryString)
      .replace("{{NEW_MESSAGE}}", prompt);
    const message: BaseMessageLike = ["human", promptWithReplacements];
    const response = await chat.call(message);
    return response?.content;
  };

  getReaction = async (
    event: string,
    chatHistory: IMessage[],
    currentBoardState: string[][]
  ): Promise<string> => {
    const chat = this.getOpenAiClient();
    const chatHistoryString = chatHistory
      .map((message) => message.content)
      .join("\n");
    const promptWithReplacements = prompts.REACTION.replace(
      "{{BOARD_STATE}}",
      currentBoardState.map((row) => row.join("")).join("\n")
    )
      .replace("{{CHAT_HISTORY}}", chatHistoryString)
      .replace("{{EVENT}}", event);
    const message: BaseMessageLike = ["human", promptWithReplacements];
    const response = await chat.call(message);
    return response?.content;
  };
}

export default LangchainService;
