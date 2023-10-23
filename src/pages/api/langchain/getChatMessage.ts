import {
  ChatRequest,
  EModels,
  IMessage,
} from "@/backend-types/langchain/langchainTypes";
import LangchainService from "@/lib/langchain/langchainService";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { prompt, chatHistory, currentBoardState, last3BoardStates, model } =
    req.body as ChatRequest;
  const langchainService = new LangchainService(model);
  try {
    const aiMessage = await langchainService.getChatResponse(
      prompt,
      chatHistory,
      currentBoardState,
      last3BoardStates
    );
    res.status(200).json(aiMessage);
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};

export default handler;
