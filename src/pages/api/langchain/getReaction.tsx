import {
  EModels,
  IGetReactionRequest,
} from "@/backend-types/langchain/langchainTypes";
import LangchainService from "@/lib/langchain/langchainService";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { event, chatHistory, model, currentBoardState } =
    req.body as IGetReactionRequest;
  const langchainService = new LangchainService(model as EModels);
  try {
    const nextMove = await langchainService.getReaction(
      event,
      chatHistory,
      currentBoardState
    );
    res.status(200).json(nextMove);
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};

export default handler;
