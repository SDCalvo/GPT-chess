import React from "react";
import { useModal } from "@/context/ModalContext";
import "./Modal.css";

const Modal: React.FC = () => {
  const { modalState, modalDispatch } = useModal();

  if (!modalState.isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-header">
        <h2>{modalState.title}</h2>
        <button onClick={() => modalDispatch({ type: "HIDE_MODAL" })}>
          Close
        </button>
      </div>
      <div className="modal-content">{modalState.content}</div>
    </div>
  );
};

export default Modal;
