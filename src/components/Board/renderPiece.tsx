import {
  faChessKing,
  faChessQueen,
  faChessRook,
  faChessBishop,
  faChessKnight,
  faChessPawn,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const piecesDict: { [key: string]: IconDefinition } = {
  K: faChessKing,
  Q: faChessQueen,
  R: faChessRook,
  B: faChessBishop,
  N: faChessKnight,
  P: faChessPawn,
  k: faChessKing,
  q: faChessQueen,
  r: faChessRook,
  b: faChessBishop,
  n: faChessKnight,
  p: faChessPawn,
};

const RenderPiece = (piece: string) => {
  const isUpperCase = piece === piece.toUpperCase();
  const color = isUpperCase ? "white" : "black";
  if (piecesDict[piece] === undefined) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90%",
        width: "90%",
        //black and white with opactiy 0.3
        backgroundColor: isUpperCase ? "#0000004d" : "#ffffff4d",
        borderRadius: "50%",
      }}
    >
      <FontAwesomeIcon
        icon={piecesDict[piece]}
        color={color}
        style={{
          fontSize: "2rem",
        }}
      />
    </div>
  );
};

export default RenderPiece;
