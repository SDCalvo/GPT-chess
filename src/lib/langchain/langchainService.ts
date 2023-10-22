import { EModels } from "@/backend-types/langchain/langchainTypes";
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
    const prompt = prompts.GET_NEXT_MOVE.replace(
      "{{BOARD_STATE}}",
      boardState.map((row) => row.join("")).join("\n")
    ).replace("{{LEGAL_MOVES}}", legalMoves.join("\n"));
    const response = await this.getGptResponse(prompt);
    return parsers.GET_NEXT_MOVE(response);
  };
}

export default LangchainService;
