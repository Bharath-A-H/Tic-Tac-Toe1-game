
import React, { useState, useEffect } from 'react';
import Board from './Board';
import './App.css';

const App = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningSquares, setWinningSquares] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/game-state')
      .then(response => response.json())
      .then(data => setSquares(data.gameState));
  }, []);

  useEffect(() => {
    const winnerData = calculateWinner(squares);
    if (winnerData) {
      setWinner(winnerData.player);
      setWinningSquares(winnerData.line);
    } else {
      setWinner(null);
      setWinningSquares([]);
    }
  }, [squares]);

  const handleClick = (i) => {
    if (winner || squares[i]) {
      return;
    }

    const player = xIsNext ? 'X' : 'O';

    fetch('http://localhost:9000/make-move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ index: i, player }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setSquares(data.gameState);
          setXIsNext(!xIsNext);
        }
      });
  };

  const resetGame = () => {
    fetch('http://localhost:9000/reset', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setSquares(data.gameState);
        setXIsNext(true);
        setWinner(null);
        setWinningSquares([]);
      });
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  return (
    <div className="game">
      <div className="game-board">

        <div id='head'>Tic-Tac-Toe</div>
        <Board squares={squares} onClick={handleClick} winningSquares={winningSquares} />
      </div>
      <div className="game-info">
        {winner ? (
          <div className="winner">Winner: {winner}</div>
        ) : (
          <div id='p'>Next player: {xIsNext ? 'X' : 'O'}</div>
        )}
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </div>
  );
};

export default App;
