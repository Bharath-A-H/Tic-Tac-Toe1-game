import React from 'react';
import Square from './Square';

const Board = ({ squares, onClick, winningSquares }) => {
  const renderSquare = (i) => {
    const isWinningSquare = winningSquares.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinningSquare={isWinningSquare}
      />
    );
  };

  const renderBoard = () => {
    let board = [];
    for (let row = 0; row < 3; row++) {
      let rowSquares = [];
      for (let col = 0; col < 3; col++) {
        rowSquares.push(renderSquare(row * 3 + col));
      }
      board.push(
        <div key={row} className="board-row">
          {rowSquares}
        </div>
      );
    }
    return board;
  };

  return <div>{renderBoard()}</div>;
};

export default Board;
