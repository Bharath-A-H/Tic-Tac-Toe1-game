
import React from 'react';

const Square = ({ value, onClick, isWinningSquare }) => (
  <button className={`square ${isWinningSquare ? 'winning-square' : ''} ${value === 'X' ? 'x-square' : value === 'O' ? 'o-square' : ''}`} onClick={onClick}>
    {value}
  </button>
);

const Board = ({ squares, onClick, winningSquares }) => (
  <div>
    <div className="board-row">
      {squares.slice(0, 3).map((value, index) => (
        <Square key={index} value={value} onClick={() => onClick(index)} isWinningSquare={winningSquares.includes(index)} />
      ))}
    </div>
    <div className="board-row">
      {squares.slice(3, 6).map((value, index) => (
        <Square key={index + 3} value={value} onClick={() => onClick(index + 3)} isWinningSquare={winningSquares.includes(index)} />
      ))}
    </div>
    <div className="board-row">
      {squares.slice(6, 9).map((value, index) => (
        <Square key={index + 6} value={value} onClick={() => onClick(index + 6)} isWinningSquare={winningSquares.includes(index)} />
      ))}
    </div>
  </div>
);

export default Board;
