import confetti from "canvas-confetti";
import { useState } from "react";
import { Game } from "./components/Game";
import { Square } from "./components/Square";
import { WinnerModal } from "./components/WinnerModal";
import { GAME_ARRAY, TURNS } from "./constants";
import {
  checkEndGame,
  checkWinner,
  resetSavedGame,
  saveGame,
} from "./logic/board";

export function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");

    // Get save game, if exists
    return boardFromStorage ? JSON.parse(boardFromStorage) : GAME_ARRAY;
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");

    // Get last save turn, if exists
    if (turnFromStorage) return turnFromStorage || TURNS.X;
  });

  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(GAME_ARRAY);
    setTurn(TURNS.X);
    setWinner(null);

    resetSavedGame();
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    saveGame(newBoard, newTurn);

    const newWinner = checkWinner(newBoard);

    if (newWinner) {
      confetti();
      setWinner(newWinner);
      return;
    }

    if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1>Connect-4</h1>

      <button onClick={resetGame}>Reset Game</button>

      <Game board={board} updateBoard={updateBoard} />

      <section className="turn">
        <Square isSelected={turn === TURNS.X}> {TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}> {TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}
