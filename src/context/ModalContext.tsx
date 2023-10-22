import React, { createContext, useReducer, useContext, ReactNode } from "react";

// Define the shape of your modal state
interface ModalState {
  isVisible: boolean;
  content: ReactNode | null; // This can hold the content of the modal
  title: string;
}

// Define the actions your reducer will handle
type ModalAction =
  | { type: "SHOW_MODAL"; payload: { content: ReactNode; title: string } }
  | { type: "HIDE_MODAL" };

// Create the initial state
const initialModalState: ModalState = {
  isVisible: false,
  content: null,
  title: "",
};

// Create your reducer
const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case "SHOW_MODAL":
      return {
        ...state,
        content: action.payload.content,
        title: action.payload.title,
        isVisible: true,
      };
    case "HIDE_MODAL":
      return {
        ...state,
        content: null,
        title: "",
        isVisible: false,
      };
    default:
      return state;
  }
};

// Create the Modal context and a custom hook to use this context
export const ModalContext = createContext<{
  modalState: ModalState;
  modalDispatch: React.Dispatch<ModalAction>;
}>({
  modalState: initialModalState,
  modalDispatch: () => undefined,
});

export const useModal = () => {
  return useContext(ModalContext);
};

// Create a provider component
interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalState, modalDispatch] = useReducer(
    modalReducer,
    initialModalState
  );

  return (
    <ModalContext.Provider value={{ modalState, modalDispatch }}>
      {children}
    </ModalContext.Provider>
  );
};
