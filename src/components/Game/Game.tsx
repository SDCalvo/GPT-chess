// src/components/Game/Game.tsx
import React, { useEffect, useState } from "react";
import Phaser from "phaser";

// Move the preload and create functions outside of the useEffect hook
function preload(this: Phaser.Scene) {
  this.load.image("character1", "/assets/character1.png");
  this.load.image("character2", "/assets/character2.png");
}

// Adjust the create function to return a function with the correct signature for Phaser.Scene.create
function create(
  currentTurn: number,
  setCurrentTurn: React.Dispatch<React.SetStateAction<number>>,
  handleApiCommand: (command: string) => Promise<void>
) {
  return function (this: Phaser.Scene) {
    const character1 = this.add.image(400, 300, "character1").setInteractive();
    const character2 = this.add.image(600, 300, "character2").setInteractive();

    this.input.on(
      "gameobjectdown",
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        if (
          (currentTurn === 1 && gameObject === character1) ||
          (currentTurn === 2 && gameObject === character2)
        ) {
          // Allow action
          setCurrentTurn(currentTurn === 1 ? 2 : 1); // Switch turns
          if (gameObject === character1) {
            handleApiCommand("moveCharacter1");
          } else if (gameObject === character2) {
            handleApiCommand("moveCharacter2");
          }
        }
      }
    );
  };
}

const Game: React.FC = () => {
  const [currentTurn, setCurrentTurn] = useState(1);

  const handleApiCommand = async (command: string) => {
    const response = await fetch("/api/game-command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });
    const data = await response.json();
    // Process API response to control characters
  };

  useEffect(() => {
    // Ensure Phaser is only imported and used on the client side
    if (typeof window !== "undefined") {
      const Phaser = require("phaser");

      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
          preload: preload,
          create: create(currentTurn, setCurrentTurn, handleApiCommand), // Use the closure to pass the arguments
        },
      };

      const game = new Phaser.Game(config);

      return () => {
        game.destroy(true);
      };
    }
  }, [currentTurn]);

  return <div id="game-container" />;
};

export default Game;
