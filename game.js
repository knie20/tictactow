'use strict';

const canvas = document.getElementById('board');
const context = canvas.getContext('2d');

const lineColor = '#000';
const xColor = '#aff';
const oColor = '#faf';
const offset = 30;
const lineWidth = 10;
const canvasSize = 500;
const halfSectionSize = canvasSize / 6;
const centerPoints = [
    [
        {
            x: halfSectionSize,
            y: halfSectionSize
        },
        {
            x: halfSectionSize * 3,
            y: halfSectionSize
        },
        {
            x: halfSectionSize * 5,
            y: halfSectionSize
        }
    ],
    [
        {
            x: halfSectionSize,
            y: halfSectionSize * 3
        },
        {
            x: halfSectionSize * 3,
            y: halfSectionSize * 3
        },
        {
            x: halfSectionSize * 5,
            y: halfSectionSize * 3
        }
    ],
    [
        {
            x: halfSectionSize,
            y: halfSectionSize * 5
        },
        {
            x: halfSectionSize * 3,
            y: halfSectionSize * 5
        },
        {
            x: halfSectionSize * 5,
            y: halfSectionSize * 5
        }
    ]
];

canvas.width = canvasSize;
canvas.height = canvasSize;

// 0 is nothing, 1 is X, 2 is O
let currentPlayer = 1;
let boardState = [[0,0,0],[0,0,0],[0,0,0]];

const drawLines = (lineWidth, color) => {
    var lineStart = 5;
    var lineLenght = canvasSize - 5;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.beginPath();
  
    // Horizontal lines 
    for (var y = 1;y <= 2;y++) {  
      context.moveTo(lineStart, y * 2 * halfSectionSize);
      context.lineTo(lineLenght, y * 2 * halfSectionSize);
    }
  
    // Vertical lines 
    for (var x = 1;x <= 2;x++) {
      context.moveTo(x * 2 * halfSectionSize, lineStart);
      context.lineTo(x * 2 * halfSectionSize, lineLenght);
    }
  
    context.stroke();
};

const drawPiece = (x, y, player) => {
    if (player == 1) {
        context.strokeStyle = xColor;
        context.beginPath();

        context.moveTo(x - halfSectionSize + offset, y - halfSectionSize + offset);
        context.lineTo(x + halfSectionSize - offset, y + halfSectionSize - offset);

        context.moveTo(x - halfSectionSize + offset, y + halfSectionSize - offset);
        context.lineTo(x + halfSectionSize - offset, y - halfSectionSize + offset);

        context.stroke();
    } else if (player == 2) {
        context.strokeStyle = oColor;
        context.beginPath();

        context.arc(x, y, halfSectionSize - offset, 0, 2 * Math.PI);

        context.stroke();
    }
};

const hasWinConditions = () => {
    let winning = false;

    boardState.forEach((row, i) => {
        if (row[0] != 0 && row[0] == row[1] && row[1] == row[2] && row[2] == row[0]){
            winning = true;
        }

        if (boardState[0][i] != 0 && boardState[0][i] == boardState[1][i] && boardState[1][i] == boardState[2][i] && boardState[0][i] == boardState[2][i]) {
            winning = true;
        }
    });

    if (boardState[0][0] != 0 && boardState[0][0] == boardState[1][1] && boardState[1][1] == boardState[2][2] && boardState[0][0] == boardState[2][2]) {
        winning = true;
    }

    if (boardState[0][2] != 0 && boardState[0][2] == boardState[1][1] && boardState[1][1] == boardState[2][0] && boardState[0][2] == boardState[2][0]) {
        winning = true;
    }

    return winning;
}

const play = (player, x, y) => {
    centerPoints.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if(x <= cell.x + halfSectionSize && x >= cell.x - halfSectionSize && y <= cell.y + halfSectionSize && y >= cell.y - halfSectionSize) {
                boardState[rowIndex][colIndex] = player;
            }
        })
    });
    
    drawPiece(x, y, player);
}

const reset = () => {
    context.clearRect(0, 0, canvasSize, canvasSize);
    currentPlayer = 1;
    boardState = [[0,0,0],[0,0,0],[0,0,0]];
    context.strokeStyle = lineColor;
    drawLines();
}

const togglePlayer = () => {
    if(currentPlayer == 1){
        currentPlayer = 2;
    } else {
        currentPlayer = 1
    }
};

const getCanvasMousePosition =  (e) => {
    const rect = canvas.getBoundingClientRect();
  
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
}

canvas.addEventListener('click', e => {
    const clickPosition = getCanvasMousePosition(e);

    play(currentPlayer, clickPosition.x, clickPosition.y);

    if(hasWinConditions()) {
        if(currentPlayer == 1) {
            alert("X Wins");
            reset();
        } else {
            alert("O Wins");
            reset();
        }
    } else {
        togglePlayer();
    }
});

drawLines(lineWidth, lineColor);