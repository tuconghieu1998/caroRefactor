import React from 'react';
import './index.css';
import Square from './square';

const MAX_ROW = 20;
const MAX_COL = 20;

function renderSquare(i, winner, value, onClick) {
  const winningSquare = winner && winner.includes(i);
  return (
    <Square value={value} onClick={onClick} winningSquare={winningSquare} />
  );
}

function Board({ winner, squares, onClick }) {
  // if (typeof squares === 'undefined');
  const boardSquares = [];
  const indexCols = [];
  indexCols.push(
    <button type="button" className="indexCol">
      {' '}
    </button>
  );
  for (let col = 0; col < MAX_COL; col += 1) {
    indexCols.push(
      <button type="button" className="indexCol">
        {col}
      </button>
    );
  }
  for (let row = 0; row < MAX_ROW; row += 1) {
    const boardRow = [];
    for (let col = 0; col < MAX_COL; col += 1) {
      boardRow.push(
        <span key={row * MAX_COL + col}>
          {renderSquare(
            row * MAX_COL + col,
            winner,
            typeof squares === 'undefined'
              ? null
              : squares[row * MAX_COL + col],
            () => onClick(row * MAX_COL + col)
          )}
        </span>
      );
    }
    boardSquares.push(
      <div className="board-row" key={row}>
        <button type="button" className="indexCol">
          {row}
        </button>
        {boardRow}
      </div>
    );
  }
  return (
    <div>
      {indexCols}
      {boardSquares}
    </div>
  );
}

export default Board;
