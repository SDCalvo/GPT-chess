import { EModels } from "@/logic/requests";
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Tool } from "langchain/tools";

enum AgentType {
  ZeroShotReactDescription = "zero-shot-react-description",
  ChatZeroShotReactDescription = "chat-zero-shot-react-description",
  ChatConversationalReactDescription = "chat-conversational-react-description",
  XML = "xml",
}

interface IAgentService {
  tools: Tool[];
  agentType: AgentType;
  model: any;
}

export class AgentService implements IAgentService {
  tools: Tool[];
  agentType: AgentType;
  model: any;

  constructor(agentType: AgentType, modelName: EModels, tools: Tool[]) {
    this.agentType = agentType;
    this.tools = tools;
    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPEN_AI_KEY as string,
      modelName: modelName,
      verbose: true,
    });
  }

  async getAgent(): Promise<AgentExecutor> {
    const agentExecutor = await initializeAgentExecutorWithOptions(
      this.tools,
      this.model,
      {
        agentType: this.agentType,
        verbose: true,
      }
    );
    return agentExecutor;
  }
}
