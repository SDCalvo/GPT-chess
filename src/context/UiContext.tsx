import { IPosition } from "@/logic/gameLogic";
import { IMessage } from "@/logic/requests";
import React, { createContext, useReducer, useContext } from "react";

interface UiState {
  playerTurn: "white" | "black";
  aiThinkingProcess: string[];
  logs: string[];
  modalContent: React.ReactNode | null;
  isModalOpen: boolean;
  chatHistory: IMessage[];
  isLoading: boolean;
}

const initialUiState: UiState = {
  playerTurn: "white",
  aiThinkingProcess: [],
  logs: [],
  modalContent: null,
  isModalOpen: false,
  chatHistory: [],
  isLoading: false,
};

export const pieceDictionary: { [key: string]: string } = {
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
    }
  | {
      type: "LOG_CAPTURE";
      payload: {
        move: string;
        player: "white" | "black";
        piece: string;
        capturedPiece: string;
      };
    }
  | { type: "LOG_CHECK"; player: "white" | "black" }
  | { type: "LOG_CHECKMATE"; winner: "white" | "black" }
  | { type: "LOG_STALEMATE" }
  | { type: "ADD_CHAT_MESSAGE"; payload: IMessage }
  | { type: "SET_LOADING" }
  | { type: "CLEAR_LOADING" };

const uiReducer = (state: UiState, action: UiAction): UiState => {
  switch (action.type) {
    case "CHANGE_TURN":
      return {
        ...state,
        playerTurn: state.playerTurn === "white" ? "black" : "white",
      };
    case "ADD_GAME_LOG":
      return { ...state, logs: [...state.logs, action.payload] };
    case "SET_AI_THINKING_PROCESS":
      return { ...state, aiThinkingProcess: action.payload };

    case "LOG_MOVE":
      return {
        ...state,
        logs: [
          ...state.logs,
          `${action.payload.player} ${
            pieceDictionary[action.payload.piece.toLowerCase()]
          } moved from ${action.payload.move}`,
        ],
      };
    case "LOG_CAPTURE":
      return {
        ...state,
        logs: [
          ...state.logs,
          `${action.payload.player} ${
            pieceDictionary[action.payload.piece.toLowerCase()]
          } captured ${
            pieceDictionary[action.payload.capturedPiece.toLowerCase()]
          } on ${action.payload.move}`,
        ],
      };

    case "LOG_CHECK":
      return {
        ...state,
        logs: [...state.logs, `${action.player} king is in check`],
      };
    case "LOG_CHECKMATE":
      return {
        ...state,
        logs: [...state.logs, `${action.winner} wins by checkmate`],
      };
    case "LOG_STALEMATE":
      return {
        ...state,
        logs: [...state.logs, `The game is a stalemate`],
      };

    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
      };

    case "SET_LOADING":
      return { ...state, isLoading: true };
    case "CLEAR_LOADING":
      return { ...state, isLoading: false };
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
