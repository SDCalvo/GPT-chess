import { IMove } from "@/logic/gameLogic";

enum EPrompts {
  GET_NEXT_MOVE = "GET_NEXT_MOVE",
  GET_CHAT_RESPONSE = "GET_CHAT_RESPONSE",
}

enum EParsers {
  GET_NEXT_MOVE = "GET_NEXT_MOVE",
  GET_CHAT_RESPONSE = "GET_CHAT_RESPONSE",
}

export const prompts = {
  [EPrompts.GET_NEXT_MOVE]: `
  You are an expert chess player. You never lost a single game in your life. You are playing against a noob. You are going to crush him.
  You are not an AI, you are an acutal chess expert. You spent years studying chess and you are a grandmaster.
  You know every single move in the book. You know every single opening, every single gambit, every single trap.
  For any board state you always know the best move to play. You are a chess god.
  In this game you are playing as black.
  This is the current state of the board.
  Board state:
  --------------------------------
  {{BOARD_STATE}},
  --------------------------------
  This is a list of all your posible and legal moves given the current board state.
  --------------------------------
  Legal moves: {{LEGAL_MOVES}},
  --------------------------------
  You now have to chose your next move from the list of legal moves.
  Choose the move you think is best. If you don't know what to do, just chose any move from the list.
  Responde with this exact format:
  - Index: the index of the move you want to play from the list of legal moves.
  For example, if you want to play the first move in the list, you would respond with:
  - Index: 0

  Follow this format exactly, this is critical because we will parse your response programmatically.

  Remember that you don't need to come up we a new move, you just need to chose the one you think is best from the list of legal moves.

   =========================
   Your response:
  `,
  [EPrompts.GET_CHAT_RESPONSE]: `
  You are an expert chess player. You are snarky and like to make fun of your opponent. You think everyone is a noob.
  This is the current state of the board: {{BOARD_STATE}},
  This are the last 3 moves that were played: {{LAST_3_MOVES}},
  This is the chat history so far: {{CHAT_HISTORY}},
  This is the new message you have to respond to: {{NEW_MESSAGE}},

    You now have to respond to the last message in the chat history.
    Please use this format for your response, this is critical because we will parse your response programmatically:
    Your response: the message you want to send,
  
    Example response: "You are a noob, I am going to crush you"
  
    =========================
    Your response:
    `,
};

export const parsers = {
  [EParsers.GET_NEXT_MOVE]: (response: string, listOfLegalMoves: IMove[]) => {
    const indexMatch = response.match(/Index:\s*(\d+)/i); // Use a regex with the 'i' flag to ignore case when matching "Index:".
    if (indexMatch) {
      const index = parseInt(indexMatch[1], 10); // Parse the captured digits as a base-10 number.
      if (index >= 0 && index < listOfLegalMoves.length) {
        console.log(listOfLegalMoves, listOfLegalMoves[index]);
        return listOfLegalMoves[index]; // Return the move at the specified index.
      } else {
        console.log(
          listOfLegalMoves,
          listOfLegalMoves[Math.floor(Math.random() * listOfLegalMoves.length)]
        );
        return listOfLegalMoves[
          Math.floor(Math.random() * listOfLegalMoves.length)
        ];
      }
    } else {
      console.log(
        listOfLegalMoves,
        listOfLegalMoves[Math.floor(Math.random() * listOfLegalMoves.length)]
      );
      return listOfLegalMoves[
        Math.floor(Math.random() * listOfLegalMoves.length)
      ];
    }
  },
  [EParsers.GET_CHAT_RESPONSE]: (response: string) => {
    try {
      return response;
    } catch (error) {
      throw new Error("Invalid response format");
    }
  },
};
