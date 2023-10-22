import Game from "@/components/Game/Game";
import "../app/globals.css";
import { GameProvider } from "@/context/GameContext";
import { UiProvider } from "@/context/UiContext";

const IndexPage: React.FC = () => {
  return (
    <GameProvider>
      <UiProvider>
        <div id="main-container">
          <Game />
        </div>
      </UiProvider>
    </GameProvider>
  );
};

export default IndexPage;
