import React from 'react';
import PropTypes from 'prop-types';
import Board from './board';

const MAX_ROW = 20;
const MAX_COL = 20;
const numToWin = 5;
// let stepNumber = 0;
let xIsNext = true;

function checkHorizontal(squares, current) {
  // Lấy tọa độ x, y
  const currentX = current % MAX_COL;
  const currentY = (current - currentX) / MAX_COL;
  let countLeft = 0;
  let isLeftBlock = false;
  let isRightBlock = false;
  let leftPoint = current;
  let rightPoint = current;
  const winningSquares = [];
  // Đếm số ký tự liên tiếp trùng với ô đang xét về bên trái
  for (let i = currentX; i >= 0; i -= 1) {
    if (squares[MAX_COL * currentY + i] === squares[current]) {
      countLeft += 1;
      leftPoint = MAX_COL * currentY + i;
    } else {
      if (squares[MAX_COL * currentY + i] !== null) {
        isLeftBlock = true;
      }
      break;
    }
  }
  // Đếm số ký tự liên tiếp trùng với ô đang xét về bên phải
  let countRight = 0;
  for (let i = currentX + 1; i < MAX_COL; i += 1) {
    if (squares[MAX_COL * currentY + i] === squares[current]) {
      countRight += 1;
      rightPoint = MAX_COL * currentY + i;
    } else {
      if (squares[MAX_COL * currentY + i] !== null) {
        isRightBlock = true;
      }
      break;
    }
  }
  // nếu lớn hơn numToWin = 5 hoặc bằng 5 và không bị chặn thì thắng
  if (
    (countLeft + countRight === numToWin && (!isLeftBlock || !isRightBlock)) ||
    countLeft + countRight > numToWin
  ) {
    for (let i = leftPoint; i <= rightPoint; i += 1) {
      winningSquares.push(i);
    }
    // console.log(winningSquares);
    return {
      winner: true,
      winningSquares
    };
  }
  return null;
}

function checkVertical(squares, current) {
  // Lấy tọa độ x, y
  const currentX = current % MAX_COL;
  const currentY = (current - currentX) / MAX_COL;
  // Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó hướng lên
  let countTop = 0;
  let isTopBlock = false;
  let isBottomBlock = false;
  let topPoint;
  let bottomPoint = current;
  for (let i = currentY; i >= 0; i -= 1) {
    if (squares[MAX_COL * i + currentX] === squares[current]) {
      countTop += 1;
      topPoint = MAX_COL * i + currentX;
    } else {
      if (squares[MAX_COL * i + currentX] !== null) {
        isTopBlock = true;
      }
      break;
    }
  }
  // Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó đi xuống
  let countBottom = 0;
  for (let i = currentY + 1; i < MAX_ROW; i += 1) {
    if (squares[MAX_COL * i + currentX] === squares[current]) {
      countBottom += 1;
      bottomPoint = MAX_COL * i + currentX;
    } else {
      if (squares[MAX_COL * i + currentX] !== null) {
        isBottomBlock = true;
      }
      break;
    }
  }
  // nếu lớn hơn numToWin = 5 hoặc bằng 5 và không bị chặn thì thắng
  if (
    (countTop + countBottom === numToWin && (!isTopBlock || !isBottomBlock)) ||
    countTop + countBottom > numToWin
  ) {
    const winningSquares = [];
    for (let i = topPoint; i <= bottomPoint; i += MAX_COL) {
      winningSquares.push(i);
    }
    return {
      winner: true,
      winningSquares
    };
  }
  return null;
}

function checkPrimary(squares, current) {
  // Lấy tọa độ x, y
  const currentX = current % MAX_COL;
  const currentY = (current - currentX) / MAX_COL;
  // Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó hướng chéo lên theo đường chéo chính
  let countTop = 0;
  let isTopBlock = false;
  let isBottomBlock = false;
  let topPoint;
  let bottomPoint = current;
  for (let i = 0; i <= currentX; i += 1) {
    // kiểm tra tọa độ đang xét có ra khỏi mảng không
    if (currentX - i < 0 || currentY - i < 0) break;
    if (squares[(currentY - i) * MAX_COL + currentX - i] === squares[current]) {
      topPoint = (currentY - i) * MAX_COL + currentX - i;
      countTop += 1;
    } else {
      if (squares[(currentY - i) * MAX_COL + currentX - i] !== null) {
        isTopBlock = true;
      }
      break;
    }
  }
  // Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó hướng chéo xuống theo đường chéo chính
  let countBottom = 0;
  for (let i = 1; i <= MAX_COL - currentX; i += 1) {
    // kiểm tra tọa độ đang xét có ra khỏi mảng không
    if (currentX + i >= MAX_COL || currentY + i >= MAX_ROW) break;
    if (squares[(currentY + i) * MAX_COL + currentX + i] === squares[current]) {
      bottomPoint = (currentY + i) * MAX_COL + currentX + i;
      countBottom += 1;
    } else {
      if (squares[(currentY + i) * MAX_COL + currentX + i] !== null) {
        isBottomBlock = true;
      }
      break;
    }
  }

  // nếu lớn hơn numToWin = 5 hoặc bằng 5 và không bị chặn thì thắng
  if (
    (countTop + countBottom === numToWin && (!isTopBlock || !isBottomBlock)) ||
    countTop + countBottom > numToWin
  ) {
    const winningSquares = [];
    for (let i = topPoint; i <= bottomPoint; i += MAX_COL + 1) {
      winningSquares.push(i);
    }
    return {
      winner: true,
      winningSquares
    };
  }
  return null;
}

function checkSub(squares, current) {
  // Lấy tọa độ x, y
  const currentX = current % MAX_COL;
  const currentY = (current - currentX) / MAX_COL;
  // Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó hướng chéo lên theo đường chéo phụ
  let countTop = 0;
  let isTopBlock = false;
  let isBottomBlock = false;
  let topPoint;
  let bottomPoint = current;
  for (let i = 0; i <= MAX_COL - currentX; i += 1) {
    // kiểm tra tọa độ đang xét có ra khỏi mảng không
    if (currentX + i >= MAX_COL || currentY - i < 0) break;
    if (squares[(currentY - i) * MAX_COL + currentX + i] === squares[current]) {
      topPoint = (currentY - i) * MAX_COL + currentX + i;
      countTop += 1;
    } else {
      if (squares[(currentY - i) * MAX_COL + currentX + i] !== null) {
        isTopBlock = true;
      }
      break;
    }
  }
  // Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó hướng chéo xuống theo đường chéo phụ
  let countBottom = 0;
  for (let i = 1; i <= currentX; i += 1) {
    // kiểm tra tọa độ đang xét có ra khỏi mảng không
    if (currentY + i >= MAX_ROW || currentX - i < 0) break;
    if (squares[(currentY + i) * MAX_COL + currentX - i] === squares[current]) {
      countBottom += 1;
      bottomPoint = (currentY + i) * MAX_COL + currentX - i;
    } else {
      if (squares[(currentY + i) * MAX_COL + currentX - i] !== null) {
        isBottomBlock = true;
      }
      break;
    }
  }

  // nếu lớn hơn numToWin = 5 hoặc bằng 5 và không bị chặn thì thắng
  if (
    (countTop + countBottom === numToWin && (!isTopBlock || !isBottomBlock)) ||
    countTop + countBottom > numToWin
  ) {
    const winningSquares = [];
    for (let i = topPoint; i <= bottomPoint; i += MAX_COL - 1) {
      winningSquares.push(i);
    }
    return {
      winner: true,
      winningSquares
    };
  }
  return null;
}

function calculateWinner(squares, current) {
  let check = checkHorizontal(squares, current);
  if (check) {
    return check;
  }
  check = checkVertical(squares, current);
  if (check) {
    return check;
  }
  check = checkPrimary(squares, current);
  if (check) {
    return check;
  }
  check = checkSub(squares, current);
  if (check) {
    return check;
  }
  return null;
  // return checkHorizontal(squares, current) || checkVertical(squares, current) || checkPrimary(squares, current) || checkSub(squares, current);
}

const Game = ({ game, addHistory, emptyHistory, setStep, changeSort }) => {
  const handleClick = i => {
    const history = game.history.slice(0, game.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, current.currentPos) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    xIsNext = !xIsNext;
    addHistory({
      squares,
      currentPos: i
    });
    setStep(history.length);
  };

  const jumpTo = step => {
    if (step === 0) {
      // Khi nhấn nút chơi lại thì remove toàn bộ history
      xIsNext = true;
      emptyHistory({});
    } else {
      setStep(step);
    }
    xIsNext = step % 2 === 0;
  };

  const changeSort1 = event => {
    changeSort(event.target.value);
  };
  console.log(game.stepNumber);
  const current = game.history[game.stepNumber];
  const winner = calculateWinner(current.squares, current.currentPos);

  const moves = game.history.slice(1).map((step, move) => {
    const moveTmp = move + 1; // bắt đầu từ 1
    const cName =
      moveTmp === game.stepNumber ? 'dropdown-item active' : 'dropdown-item';
    // Format: Bước thứ n (x, y)
    const desc = `Bước thứ ${moveTmp} (${game.history[moveTmp].currentPos %
      MAX_COL}, ${(game.history[moveTmp].currentPos -
      (game.history[moveTmp].currentPos % MAX_COL)) /
      MAX_COL})`;
    return (
      <li key={moveTmp}>
        <button type="button" className={cName} onClick={() => jumpTo(moveTmp)}>
          {desc}
        </button>
      </li>
    );
  });

  if (game.arrange === 'DESC') {
    moves.reverse();
  }

  let status;
  if (winner) {
    status = `Người chiến thắng: ${current.squares[current.currentPos]}`;
  } else {
    status = `Lượt kế tiếp: ${xIsNext ? 'X' : 'O'}`;
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={i => handleClick(i)}
          winner={winner && winner.winningSquares}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button
          type="button"
          className="btn btn-success mt-2"
          onClick={() => jumpTo(0)}
        >
          Chơi lại
        </button>
        <div className="d-flex justify-content-start mt-2">
          <div className="dropdown">
            <button
              className="btn btn-info dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Lịch sử nước đi
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {moves}
            </div>
          </div>
          <div className="form-group ml-3">
            <select
              className="form-control"
              id="sel1"
              onChange={changeSort1}
              value={game.arrange}
            >
              <option value="ASC">Tăng dần</option>
              <option value="DESC">Giảm dần</option>
            </select>
          </div>
        </div>
        {/* {<ol>{moves}</ol>} */}
      </div>
    </div>
  );
};

// ========================================
Game.propTypes = {
  game: PropTypes.shape({
    history: PropTypes.arrayOf(
      PropTypes.shape({
        squares: PropTypes.arrayOf(Int32Array).isRequired,
        currentPos: PropTypes.number.isRequired
      }).isRequired
    ).isRequired,
    stepNumber: PropTypes.number.isRequired
  }).isRequired,
  addHistory: PropTypes.func.isRequired,
  emptyHistory: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
  changeSort: PropTypes.func.isRequired
};
export default Game;
