import Game from "@/components/Game/Game";
import "../app/globals.css";
import { GameProvider } from "@/context/GameContext";

const IndexPage: React.FC = () => {
  return (
    <GameProvider>
      <div id="game-container">
        <Game />
      </div>
    </GameProvider>
  );
};

export default IndexPage;
