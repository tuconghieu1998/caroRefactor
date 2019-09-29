import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const MAX_ROW = 20;
const MAX_COL = 20;
const numToWin = 5;

function Square(props) {
    const winningSquareStyle = {
        backgroundColor: '#ccc'
    };
    return (
        <button className="square" onClick={props.onClick} style={props.winningSquare ? winningSquareStyle : null}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                winningSquare={winningSquare}
            />
        );
    }


    render() {
        let boardSquares = [];
        let indexCols = [];
        indexCols.push(<button className="indexCol">
        </button>)
        for (let col = 0; col < MAX_COL; col++) {
            indexCols.push(<button className="indexCol">
                {col}
            </button>)
        }
        for (let row = 0; row < MAX_ROW; row++) {
            let boardRow = [];
            for (let col = 0; col < MAX_COL; col++) {
                boardRow.push(<span key={(row * MAX_COL) + col}>{this.renderSquare((row * MAX_COL) + col)}</span>)
            }
            boardSquares.push(<div className="board-row" key={row}>
                <button className="indexCol">
                    {row}
                </button>
                {boardRow}
            </div>)
        }
        return (
            <div>
                {indexCols}
                {boardSquares}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(MAX_COL * MAX_ROW).fill(null),
                currentPos: -1,
            }],
            stepNumber: 0,
            xIsNext: true,
            arrange: "ASC", // sắp xếp lịch sử trong dropdown tăng dần
        };
        this.changeSort = this.changeSort.bind(this);
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares, current.currentPos) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                currentPos: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        if (step === 0) {
            //Khi nhấn nút chơi lại thì remove toàn bộ history
            this.setState({
                history: [{
                    squares: Array(MAX_COL * MAX_ROW).fill(null),
                    currentPos: -1,
                }],
                stepNumber: 0,
                xIsNext: true,
            });
        }
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    changeSort(event) {
        this.setState({ arrange: event.target.value });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares, current.currentPos);

        const moves = history.slice(1).map((step, move) => {
            move++;//bắt đầu từ 1
            let cName = move === this.state.stepNumber ? 'dropdown-item active' : 'dropdown-item';
            //Format: Bước thứ n (x, y)
            const desc = 'Bước thứ ' + move + ' (' + history[move].currentPos % MAX_COL + ', ' + (history[move].currentPos - history[move].currentPos % MAX_COL) / MAX_COL + ')';
            return (
                <li key={move}>
                    <button className={cName} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        if (this.state.arrange === "DESC") {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Người chiến thắng: ' + current.squares[current.currentPos];
        } else {
            status = 'Lượt kế tiếp: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winner={winner && winner.winningSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button className="btn btn-success mt-2" onClick={() => this.jumpTo(0)}>Chơi lại</button>
                    <div className="d-flex justify-content-start mt-2">
                        <div className="dropdown">
                            <button className="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Lịch sử nước đi
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {moves}
                            </div>
                        </div>
                        <div className="form-group ml-3">
                            <select className="form-control" id="sel1" onChange={this.changeSort} value={this.state.arrange}>
                                <option value="ASC">Tăng dần</option>
                                <option value="DESC">Giảm dần</option>
                            </select>
                        </div>
                    </div>
                    {/* {<ol>{moves}</ol>} */}
                </div>
            </div>
        );
    }
}

function calculateWinner(squares, current) {
    var check = checkHorizontal(squares, current);
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
    //return checkHorizontal(squares, current) || checkVertical(squares, current) || checkPrimary(squares, current) || checkSub(squares, current);
}

function checkHorizontal(squares, current) {
    //Lấy tọa độ x, y
    let currentX = current % MAX_COL;
    let currentY = (current - currentX) / MAX_COL;
    var countLeft = 0;
    var isLeftBlock = false;
    var isRightBlock = false;
    var leftPoint = current;
    var rightPoint = current;
    let winningSquares = [];
    //Đếm số ký tự liên tiếp trùng với ô đang xét về bên trái
    for (let i = currentX; i >= 0; i--) {
        if (squares[MAX_COL * currentY + i] === squares[current]) {
            countLeft++;
            leftPoint = MAX_COL * currentY + i;
        }
        else {
            if (squares[MAX_COL * currentY + i] !== null) {
                isLeftBlock = true;
            }
            break;
        }
    }
    //Đếm số ký tự liên tiếp trùng với ô đang xét về bên phải
    var countRight = 0;
    for (let i = currentX + 1; i < MAX_COL; i++) {
        if (squares[MAX_COL * currentY + i] === squares[current]) {
            countRight++;
            rightPoint = MAX_COL * currentY + i;
        }
        else {
            if (squares[MAX_COL * currentY + i] !== null) {
                isRightBlock = true;
            }
            break;
        }
    }
    //nếu lớn hơn numToWin = 5 hoặc bằng 5 và không bị chặn thì thắng
    if ((countLeft + countRight === numToWin && (!isLeftBlock || !isRightBlock)) || countLeft + countRight > numToWin) {

        for (let i = leftPoint; i <= rightPoint; i++) {
            winningSquares.push(i);
        }
        //console.log(winningSquares);
        return {
            winner: true,
            winningSquares: winningSquares
        }
    }
    else {
        return null;
    }
}

function checkVertical(squares, current) {
    //Lấy tọa độ x, y
    let currentX = current % MAX_COL;
    let currentY = (current - currentX) / MAX_COL;
    //Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó hướng lên
    var countTop = 0;
    var isTopBlock = false;
    var isBottomBlock = false;
    var topPoint, bottomPoint = current;
    for (let i = currentY; i >= 0; i--) {
        if (squares[MAX_COL * i + currentX] === squares[current]) {
            countTop++;
            topPoint = MAX_COL * i + currentX;
        }
        else {
            if (squares[MAX_COL * i + currentX] !== null) {
                isTopBlock = true;
            }
            break;
        }
    }
    //Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó đi xuống
    var countBottom = 0;
    for (let i = currentY + 1; i < MAX_ROW; i++) {
        if (squares[MAX_COL * i + currentX] === squares[current]) {
            countBottom++;
            bottomPoint = MAX_COL * i + currentX;
        }
        else {
            if (squares[MAX_COL * i + currentX] !== null) {
                isBottomBlock = true;
            }
            break;
        }
    }
    //nếu lớn hơn numToWin = 5 hoặc bằng 5 và không bị chặn thì thắng
    if ((countTop + countBottom === numToWin && (!isTopBlock || !isBottomBlock)) || countTop + countBottom > numToWin) {
        var winningSquares = [];
        for (let i = topPoint; i <= bottomPoint; i += MAX_COL) {
            winningSquares.push(i);
        }
        return {
            winner: true,
            winningSquares: winningSquares
        }
    }
    else {
        return null;
    }
}

function checkPrimary(squares, current) {
    //Lấy tọa độ x, y
    let currentX = current % MAX_COL;
    let currentY = (current - currentX) / MAX_COL;
    //Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó hướng chéo lên theo đường chéo chính
    var countTop = 0;
    var isTopBlock = false;
    var isBottomBlock = false;
    var topPoint, bottomPoint = current;
    for (let i = 0; i <= currentX; i++) {
        //kiểm tra tọa độ đang xét có ra khỏi mảng không
        if (currentX - i < 0 || currentY - i < 0)
            break;
        if (squares[(currentY - i) * MAX_COL + currentX - i] === squares[current]) {
            topPoint = (currentY - i) * MAX_COL + currentX - i;
            countTop++;
        }
        else {
            if (squares[(currentY - i) * MAX_COL + currentX - i] !== null) {
                isTopBlock = true;
            }
            break;
        }
    }
    //Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó hướng chéo xuống theo đường chéo chính
    var countBottom = 0;
    for (let i = 1; i <= MAX_COL - currentX; i++) {
        //kiểm tra tọa độ đang xét có ra khỏi mảng không
        if (currentX + i >= MAX_COL || currentY + i >= MAX_ROW)
            break;
        if (squares[(currentY + i) * MAX_COL + currentX + i] === squares[current]) {
            bottomPoint = (currentY + i) * MAX_COL + currentX + i;
            countBottom++;
        }
        else {
            if (squares[(currentY + i) * MAX_COL + currentX + i] !== null) {
                isBottomBlock = true;
            }
            break;
        }
    }

    //nếu lớn hơn numToWin = 5 hoặc bằng 5 và không bị chặn thì thắng
    if ((countTop + countBottom === numToWin && (!isTopBlock || !isBottomBlock)) || countTop + countBottom > numToWin) {
        var winningSquares = [];
        for (let i = topPoint; i <= bottomPoint; i += (MAX_COL + 1)) {
            winningSquares.push(i);
        }
        return {
            winner: true,
            winningSquares: winningSquares
        }
    }
    else {
        return null;
    }
}

function checkSub(squares, current) {
    //Lấy tọa độ x, y
    let currentX = current % MAX_COL;
    let currentY = (current - currentX) / MAX_COL;
    //Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó hướng chéo lên theo đường chéo phụ
    var countTop = 0;
    var isTopBlock = false;
    var isBottomBlock = false;
    var topPoint, bottomPoint = current;
    for (let i = 0; i <= MAX_COL - currentX; i++) {
        //kiểm tra tọa độ đang xét có ra khỏi mảng không
        if (currentX + i >= MAX_COL || currentY - i < 0)
            break;
        if (squares[(currentY - i) * MAX_COL + currentX + i] === squares[current]) {
            topPoint = (currentY - i) * MAX_COL + currentX + i;
            countTop++;
        }
        else {
            if (squares[(currentY - i) * MAX_COL + currentX + i] !== null) {
                isTopBlock = true;
            }
            break;
        }
    }
    //Đếm số ký tự liên tiếp trùng với ô đang xét từ ô đó hướng chéo xuống theo đường chéo phụ
    var countBottom = 0;
    for (let i = 1; i <= currentX; i++) {
        //kiểm tra tọa độ đang xét có ra khỏi mảng không
        if (currentY + i >= MAX_ROW || currentX - i < 0)
            break;
        if (squares[(currentY + i) * MAX_COL + currentX - i] === squares[current]) {
            countBottom++;
            bottomPoint = (currentY + i) * MAX_COL + currentX - i;
        }
        else {
            if (squares[(currentY + i) * MAX_COL + currentX - i] !== null) {
                isBottomBlock = true;
            }
            break;
        }
    }

    //nếu lớn hơn numToWin = 5 hoặc bằng 5 và không bị chặn thì thắng
    if ((countTop + countBottom === numToWin && (!isTopBlock || !isBottomBlock)) || countTop + countBottom > numToWin) {
        var winningSquares = [];
        for (let i = topPoint; i <= bottomPoint; i += (MAX_COL - 1)) {
            winningSquares.push(i);
        }
        return {
            winner: true,
            winningSquares: winningSquares
        }
    }
    else {
        return null;
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
