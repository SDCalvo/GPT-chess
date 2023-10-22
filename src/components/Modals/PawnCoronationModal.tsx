import { GameContext } from "@/context/GameContext";
import { UiContext, pieceDictionary } from "@/context/UiContext";
import { useContext } from "react";
import "./PawnCoronationModal.css";
import RenderPiece from "../Board/renderPiece";
import { ModalContext } from "@/context/ModalContext";

interface PawnCoronationModalProps {
  position: { row: number; column: number };
}

const PawnCoronationModal: React.FC<PawnCoronationModalProps> = ({
  position,
}: PawnCoronationModalProps) => {
  const { dispatch } = useContext(GameContext);
  const { modalDispatch } = useContext(ModalContext);
  const { uiDispatch } = useContext(UiContext);

  const handlePieceSelection = (newPiece: string) => {
    dispatch({ type: "PAWN_CORONATION", payload: { position, newPiece } });
    uiDispatch({
      type: "ADD_GAME_LOG",
      payload: `Pawn coronated to ${pieceDictionary[newPiece.toLowerCase()]}`,
    });
    modalDispatch({ type: "HIDE_MODAL" });
  };

  return (
    <div className="coronation-modal">
      <p className="coronation-modal-message">Select new piece:</p>
      <button
        onClick={() => handlePieceSelection("Q")}
        className="coronation-button"
      >
        {RenderPiece("Q", false)}
      </button>
      <button
        onClick={() => handlePieceSelection("R")}
        className="coronation-button"
      >
        {RenderPiece("R", false)}
      </button>
      <button
        onClick={() => handlePieceSelection("N")}
        className="coronation-button"
      >
        {RenderPiece("N", false)}
      </button>
      <button
        onClick={() => handlePieceSelection("B")}
        className="coronation-button"
      >
        {RenderPiece("B", false)}
      </button>
    </div>
  );
};

export default PawnCoronationModal;
