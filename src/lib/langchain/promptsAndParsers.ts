enum EPrompts {
  GET_NEXT_MOVE = "GET_NEXT_MOVE",
}

enum EParsers {
  GET_NEXT_MOVE = "GET_NEXT_MOVE",
}

export const prompts = {
  [EPrompts.GET_NEXT_MOVE]: `
  You are an expert chess player. You are playing as black.
  This is the current state of the board: {{BOARD_STATE}},
  This is a list of all your legal moves given the current board state: {{LEGAL_MOVES}},

   You now have to chose your next move from the list of legal moves.
   Please use this format for your response, this is critical because we will parse your response programmatically:
   Piece: the piece you are moving,
   From: the position of the piece you are moving,
   To: the position you are moving the piece to,

   Example response: {
    "piece": "p",
    "from": {
      "row": 1,
      "column": 4
    },
    "to": {
      "row": 2,
      "column": 4
    }
  }

  Remember that you don't need to come up we a new move, you just need to chose the one you think is best from the list of legal moves.

   =========================
   Your response:
  `,
};

export const parsers = {
  [EParsers.GET_NEXT_MOVE]: (response: string) => {
    try {
      const parsedResponse = JSON.parse(response);
      return {
        piece: parsedResponse.piece,
        from: {
          row: parsedResponse.from.row - 1,
          column: parsedResponse.from.column - 1,
        },
        to: {
          row: parsedResponse.to.row - 1,
          column: parsedResponse.to.column - 1,
        },
      };
    } catch (error) {
      throw new Error("Invalid response format");
    }
  },
};
