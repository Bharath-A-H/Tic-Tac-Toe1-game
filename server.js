const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const GameResult = require('./models/GameResult');

const app = express();
const port = 9000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tictactoe', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

let gameState = Array(9).fill(null);

app.get('/', (req, res) => {
  res.send('Welcome to the Tic-Tac-Toe game API!');
});

app.get('/game-state', (req, res) => {
  res.json({ gameState });
});

app.post('/make-move', (req, res) => {
  const { index, player } = req.body;
  if (gameState[index] === null) {
    gameState[index] = player;

    const winnerData = calculateWinner(gameState);
    if (winnerData) {
      const winner = winnerData.player;
      const loser = winner === 'X' ? 'O' : 'X';

      // Save the game result to the database
      const gameResult = new GameResult({
        winner,
        loser,
        gameState
      });

      gameResult.save()
        .then(() => res.json({ success: true, gameState, winner }))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
    } else {
      res.json({ success: true, gameState });
    }
  } else {
    res.json({ success: false });
  }
});

app.post('/reset', (req, res) => {
  gameState = Array(9).fill(null);
  res.json({ success: true, gameState });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
};
