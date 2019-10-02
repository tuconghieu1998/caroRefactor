import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Square from './square';

const MAX_ROW = 20;
const MAX_COL = 20;

class Board extends React.Component {
  renderSquare(i) {
    const { winner } = this.props;
    const { squares } = this.props;
    const { onClick } = this.props;
    const winningSquare = winner && winner.includes(i);
    return (
      <Square
        value={squares ? squares[i] : null}
        onClick={onClick}
        winningSquare={winningSquare}
      />
    );
  }

  render() {
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
            {this.renderSquare(row * MAX_COL + col)}
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
}

ReactDOM.render(<Board />, document.getElementById('root'));
