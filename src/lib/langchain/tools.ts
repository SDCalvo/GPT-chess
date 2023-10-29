import { CustomTool } from "./customTool";

class SumTool extends CustomTool {
  name: string;
  description: string;

  constructor() {
    super();
    this.name = "Sum Tool";
    this.description =
      "This tool sums two numbers and returns the result. The input should be an array of two numbers. eg. [1, 2]";
  }

  func(inputString: string): Promise<string> {
    const input = JSON.parse(inputString);
    const result = input.reduce((a: number, b: number) => a + b, 0);
    this.dataStore["result"] = result;
    return Promise.resolve(result.toString());
  }
}

class SubtractTool extends CustomTool {
  name: string;
  description: string;

  constructor() {
    super();
    this.name = "Subtract Tool";
    this.description =
      "This tool subtracts two numbers and returns the result. The input should be an array of two numbers. eg. [1, 2]";
  }

  func(inputString: string): Promise<string> {
    const input = JSON.parse(inputString);
    const result = input.reduce((a: number, b: number) => a - b, 0);
    this.dataStore["result"] = result;
    return Promise.resolve(result.toString());
  }
}

export class Tools {
  static sum = new SumTool();
  static subtract = new SubtractTool();

  static getToolsArray(): CustomTool[] {
    return Object.values(Tools).filter(
      (item) => item instanceof CustomTool
    ) as CustomTool[];
  }
}

// const myToolsArr = Tools.getToolsArray();

// Accessing data stores directly on the Tools class:
// console.log(Tools.sum.dataStore);
// console.log(Tools.subtract.dataStore);
