import React, { useState, useEffect } from 'react';
import Board from './Board';
import './App.css';

const App = () => {
  const [squares, setSquares] = useState(Array(9).fill(null)); // Array to hold the state of each square
  const [xIsNext, setXIsNext] = useState(true); // Boolean to track which player's turn it is
  const [winner, setWinner] = useState(null); // State to store the winner
  const [winningSquares, setWinningSquares] = useState([]); // State to store the winning line
  const [player1, setPlayer1] = useState('Player 1');
  const [player2, setPlayer2] = useState('Player 2');

  useEffect(() => {
    fetch('http://localhost:9001/game-state')
      .then(response => response.json())
      .then(data => {
        setSquares(data.gameState);
        setPlayer1(data.player1);
        setPlayer2(data.player2);
      });
  }, []);

  useEffect(() => {
    const winnerData = calculateWinner(squares);
    if (winnerData) {
      const winningPlayer = winnerData.player === 'X' ? player1 : player2;
      setWinner(winningPlayer);
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

    fetch('http://localhost:9001/make-move', {
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
          if (data.winner) {
            setWinner(data.winner); 
          }
        }
      });
  };

  const resetGame = () => {
    fetch('http://localhost:9001/reset', { method: 'POST' })
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
        <div id="head">Tic-Tac-Toe</div>
        <Board squares={squares} onClick={handleClick} winningSquares={winningSquares} />
      </div>
      <div className="game-info">
        {winner ? (
          <>
            <div className="winner">Winner: {winner}</div>
            <button onClick={resetGame}>Start New Game</button>
          </>
        ) : (
          <>
            <div id="p">Next player: {xIsNext ? player1 : player2}</div>
            <button onClick={resetGame}>Reset Game</button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
