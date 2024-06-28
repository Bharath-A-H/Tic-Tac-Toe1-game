import React from 'react';

const Square = ({ value, onClick, isWinningSquare }) => {
  return (
    <button
      className={`square ${value} ${isWinningSquare ? 'winning-square' : ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
