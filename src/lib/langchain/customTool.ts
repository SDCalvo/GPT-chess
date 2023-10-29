import { DynamicTool, Tool } from "langchain/tools";

interface ICustomTool {
  name: string;
  description: string;
  dataStore: Record<string, unknown>;
  func: (inputString: string) => Promise<string>;
}

export abstract class CustomTool implements ICustomTool {
  abstract name: string;
  abstract description: string;
  dataStore: Record<string, any>;

  constructor() {
    this.dataStore = {};
  }

  abstract func(inputString: string): Promise<string>;

  getTool(): Tool {
    return new DynamicTool({
      name: this.name,
      description: this.description,
      func: this.func,
    });
  }
}
