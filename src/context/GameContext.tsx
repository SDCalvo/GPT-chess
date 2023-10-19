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
};

const gameReducer = (state: any, action: any) => {
  switch (action.type) {
    case "MOVE_PIECE":
      // Complete latter
      return state;
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
