
const { createReply, waitForUserMove } = require('./utils'); // Assuming you have a utility module for handling replies and user moves

module.exports = {
  config: {
    name: "tictactoe",
    aliases: ["ttt", "tic"],
    version: "1.0.0",
    author: "ayanfe",
    shortDescription: "Play a game of Tic-Tac-Toe.",
    longDescription: "Challenge someone to a game of Tic-Tac-Toe.",
    category: "games",
    guide: {
      en: "{pn} @mention"
    },
    usages: "/tictactoe @mention",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs": "",
      "path": ""
    }
  },
  onStart: async function({ message, api, args, event }) {
    const gameBoard = [
      ['-', '-', '-'],
      ['-', '-', '-'],
      ['-', '-', '-']
    ];
    let currentPlayer = 'X';
    let opponent = event.messageReply?.mentions[0];

    if (!opponent) {
      return createReply(message, "Please mention someone to play with. Usage: /tictactoe @player");
    }

    const renderBoard = () => {
      return gameBoard.map(row => row.join(' | ')).join('\n---------\n');
    };

    const checkWin = () => {
      for (let i = 0; i < 3; i++) {
        if (gameBoard[i][0] === currentPlayer && gameBoard[i][1] === currentPlayer && gameBoard[i][2] === currentPlayer) {
          return true;
        }
        if (gameBoard[0][i] === currentPlayer && gameBoard[1][i] === currentPlayer && gameBoard[2][i] === currentPlayer) {
          return true;
        }
      }
      if (gameBoard[0][0] === currentPlayer && gameBoard[1][1] === currentPlayer && gameBoard[2][2] === currentPlayer) {
        return true;
      }
      if (gameBoard[0][2] === currentPlayer && gameBoard[1][1] === currentPlayer && gameBoard[2][0] === currentPlayer) {
        return true;
      }
      return false;
    };

    const checkDraw = () => {
      return gameBoard.every(row => row.every(cell => cell !== '-'));
    };

    const makeMove = async (row, col) => {
      if (gameBoard[row][col] !== '-') {
        await createReply(message, "Invalid move! The cell is already taken.");
        return;
      }

      gameBoard[row][col] = currentPlayer;

      if (checkWin()) {
        await createReply(message, `Player ${currentPlayer} wins!\n${renderBoard()}`);
        return true;
      }

      if (checkDraw()) {
        await createReply(message, `It's a draw!\n${renderBoard()}`);
        return true;
      }

      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      await createReply(message, `Current board:\n${renderBoard()}\n\nIt's ${currentPlayer}'s turn!`);
      return false;
    };

    await createReply(message, `Tic-Tac-Toe game started between @${event.senderID} and @${opponent}!\n\n${renderBoard()}\n\n${currentPlayer}'s turn!`);

    let gameEnded = false;

    while (!gameEnded) {
      const nextMove = await waitForUserMove(api, event, currentPlayer, opponent);
      const [row, col] = nextMove.split(' ').map(Number);

      if (row < 0 || row > 2 || col < 0 || col > 2) {
        await createReply(message, "Invalid move! Please choose a row and column between 0 and 2.");
        continue;
      }

      gameEnded = await makeMove(row, col);
    }
  }
};
