import React from 'react';
import './index.css';

function Square(props) {
  const winningSquareStyle = {
    backgroundColor: '#ccc'
  };
  const { value, onClick, winningSquare } = props;
  return (
    <button
      type="button"
      className="square"
      onClick={onClick}
      style={winningSquare ? winningSquareStyle : null}
    >
      {value}
    </button>
  );
}
// ========================================

export default Square;
