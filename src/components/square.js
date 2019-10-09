import React from 'react';
import PropTypes from 'prop-types';

const Square = ({ value, onClick, winningSquare }) => {
  const winningSquareStyle = {
    backgroundColor: '#ccc'
  };
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
};

// ========================================
Square.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  winningSquare: PropTypes.bool.isRequired
};
export default Square;
