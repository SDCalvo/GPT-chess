import React, { useReducer, createContext } from "react";

//Prop types
interface GameContextProps {
  state: any;
  dispatch: any;
}

//GameProvider interface
interface GameProviderProps {
  children: React.ReactNode;
}

export enum EGameStatus {
  Ongoing = "ongoing",
  Checkmate = "checkmate",
  Stalemate = "stalemate",
  Draw = "draw",
}

const initialBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const initialState = {
  board: initialBoard,
  selectedPiece: null,
  currentTurn: "white",
  gameStatus: EGameStatus.Ongoing,
};

const gameReducer = (state: any, action: any) => {
  switch (action.type) {
    case "MOVE_PIECE":
      const newBoardMove = state.board.map((row: string[], rowIndex: number) =>
        row.map((cell: string, colIndex: number) =>
          rowIndex === action.payload.from.row &&
          colIndex === action.payload.from.column
            ? ""
            : rowIndex === action.payload.to.row &&
              colIndex === action.payload.to.column
            ? state.board[action.payload.from.row][action.payload.from.column]
            : cell
        )
      );
      return {
        ...state,
        board: newBoardMove,
        currentTurn: state.currentTurn === "white" ? "black" : "white",
      };

    case "CAPTURE_PIECE":
      const newBoardCapture = state.board.map(
        (row: string[], rowIndex: number) =>
          row.map((cell: string, colIndex: number) =>
            rowIndex === action.payload.from.row &&
            colIndex === action.payload.from.column
              ? ""
              : rowIndex === action.payload.to.row &&
                colIndex === action.payload.to.column
              ? state.board[action.payload.from.row][action.payload.from.column]
              : cell
          )
      );
      return {
        ...state,
        board: newBoardCapture,
        currentTurn: state.currentTurn === "white" ? "black" : "white",
      };

    case "SELECT_PIECE":
      return { ...state, selectedPiece: action.payload };

    case "CLEAR_SELECTED_PIECE":
      return { ...state, selectedPiece: null };

    case "CHANGE_TURN":
      const updatedState = {
        ...state,
        currentTurn: state.currentTurn === "white" ? "black" : "white",
      };
      return updatedState;

    case "CHECKMATE":
      return {
        ...state,
        gameStatus: EGameStatus.Checkmate,
        winner: action.payload.winner,
      };

    case "STALEMATE":
      return {
        ...state,
        gameStatus: EGameStatus.Stalemate,
      };

    case "DRAW":
      return {
        ...state,
        gameStatus: EGameStatus.Draw,
      };

    default:
      return state;
  }
};

export const GameContext = createContext<GameContextProps>({
  state: initialState,
  dispatch: () => {},
});

export const GameProvider = ({ children }: GameProviderProps) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
