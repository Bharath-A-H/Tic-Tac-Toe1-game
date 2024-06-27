const express = require('express');
const cors = require('cors');
const app = express();
const port = 9000;

app.use(cors());
app.use(express.json());

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
    res.json({ success: true, gameState });
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
