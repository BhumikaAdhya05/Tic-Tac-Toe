function startGame() {
    // Get player names from input fields
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;
  
    // Redirect to the next page with player names as URL parameters
    window.location.href = `start-game.html?player1=${encodeURIComponent(player1)}&player2=${encodeURIComponent(player2)}`;
}

const urlParams = new URLSearchParams(window.location.search);
const player1Name = urlParams.get('player1');
const player2Name = urlParams.get('player2');

let currentPlayer = player1Name;
document.getElementById('current-player').textContent = `Current Player: ${currentPlayer}`;
const board = ['', '', '', '', '', '', '', '', ''];
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const clickSound = document.getElementById('click-sound');

function handleCellClick(index) {
  if (!board[index]) {

    clickSound.currentTime = 0; // Reset sound to the beginning
    clickSound.play();

    board[index] = currentPlayer === player1Name ? 'X' : 'O';
    document.querySelector(`.cell[data-index="${index}"]`).textContent = board[index];

    if (checkWin()) {
        setTimeout(() => {
            alert(`${currentPlayer} wins!`);
            resetGame();
        }, 400);
    } else if (board.every(cell => cell)) {
        setTimeout(() => {
            alert("It's a draw!");
            resetGame();
        }, 400);
    } else {
        currentPlayer = currentPlayer === player1Name ? player2Name : player1Name;
        document.getElementById('current-player').textContent = `Current Player: ${currentPlayer}`;
    }
    }
}

function checkWin() {
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        // Add winning class to the winning cells
         drawWinningLine(combination);
         return true;
    }
    return false;
  });
}

function drawWinningLine(combination) {
    const cells = document.querySelectorAll('.cell');
    const gameBoard = document.getElementById('gameBoard');

    // Remove any existing winning line
    document.querySelector('.winning-line')?.remove();

    // Create the line element
    const line = document.createElement('div');
    line.classList.add('winning-line');

    // Get the start and end cell coordinates based on the winning combination
    const [startIndex, , endIndex] = combination;
    const startCell = cells[startIndex].getBoundingClientRect();
    const endCell = cells[endIndex].getBoundingClientRect();

    // Calculate line's position, length, and angle
    const startX = startCell.left + startCell.width / 2;
    const startY = startCell.top + startCell.height / 2;
    const endX = endCell.left + endCell.width / 2;
    const endY = endCell.top + endCell.height / 2;

    const dx = endX - startX;
    const dy = endY - startY;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Apply styles to the line element
    line.style.width = `${lineLength}px`;
    line.style.height = '2px';
    line.style.position = 'absolute';
    line.style.top = `${startY - 1}px`; // Adjust for line thickness
    line.style.left = `${startX - 1}px`; // Adjust for line thickness
    line.style.transformOrigin = 'left center';
    line.style.transform = `rotate(${angle}deg)`;
    line.style.backgroundColor = 'red';

    // Append the line to the game board
    gameBoard.appendChild(line);
}

function resetGame() {
  board.fill('');
  document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
  document.querySelector('.winning-line')?.remove();

  currentPlayer = player1Name;
  document.getElementById('current-player').textContent = `Current Player: ${currentPlayer}`;
}
  
// Attach event listeners to cells
document.querySelectorAll('.cell').forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
});
