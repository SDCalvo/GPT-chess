import Game from "@/components/Game/Game";
import "../app/globals.css";
import { GameProvider } from "@/context/GameContext";
import { UiProvider } from "@/context/UiContext";
import { ModalProvider } from "@/context/ModalContext";

const IndexPage: React.FC = () => {
  return (
    <GameProvider>
      <UiProvider>
        <ModalProvider>
          <div id="main-container">
            <Game />
          </div>
        </ModalProvider>
      </UiProvider>
    </GameProvider>
  );
};

export default IndexPage;
