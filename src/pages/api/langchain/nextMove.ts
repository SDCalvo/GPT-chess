import { EModels } from "@/backend-types/langchain/langchainTypes";
import LangchainService from "@/lib/langchain/langchainService";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { boardState, legalMoves, model } = req.body;
  const langchainService = new LangchainService(model as EModels);
  try {
    const nextMove = await langchainService.getNextAiMove(
      boardState,
      legalMoves
    );
    res.status(200).json(nextMove);
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};

export default handler;
