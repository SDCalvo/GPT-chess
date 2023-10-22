import { IPosition } from "@/logic/gameLogic";
import React, { createContext, useReducer, useContext } from "react";

interface UiState {
  playerTurn: "white" | "black";
  gameLogs: string[];
  aiThinkingProcess: string[];
  moveLog: string[];
}

const initialUiState: UiState = {
  playerTurn: "white",
  gameLogs: [],
  aiThinkingProcess: [],
  moveLog: [],
};

const pieceDictionary: { [key: string]: string } = {
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king",
  p: "pawn",
};

type UiAction =
  | { type: "CHANGE_TURN" }
  | { type: "ADD_GAME_LOG"; payload: string }
  | { type: "SET_AI_THINKING_PROCESS"; payload: string[] }
  | {
      type: "LOG_MOVE";
      payload: { move: string; player: "white" | "black"; piece: string };
    };

const uiReducer = (state: UiState, action: UiAction): UiState => {
  switch (action.type) {
    case "CHANGE_TURN":
      return {
        ...state,
        playerTurn: state.playerTurn === "white" ? "black" : "white",
      };
    case "ADD_GAME_LOG":
      return { ...state, gameLogs: [...state.gameLogs, action.payload] };
    case "SET_AI_THINKING_PROCESS":
      return { ...state, aiThinkingProcess: action.payload };

    case "LOG_MOVE":
      return {
        ...state,
        moveLog: [
          ...state.moveLog,
          `${action.payload.player} ${
            pieceDictionary[action.payload.piece.toLowerCase()]
          } moved from ${action.payload.move}`,
        ],
      };
    default:
      return state;
  }
};

export const UiContext = createContext<{
  uiState: UiState;
  uiDispatch: React.Dispatch<UiAction>;
}>({ uiState: initialUiState, uiDispatch: () => undefined });

interface UiProviderProps {
  children: React.ReactNode;
}

export const UiProvider: React.FC<UiProviderProps> = ({ children }) => {
  const [uiState, uiDispatch] = useReducer(uiReducer, initialUiState);
  return (
    <UiContext.Provider value={{ uiState, uiDispatch }}>
      {children}
    </UiContext.Provider>
  );
};
