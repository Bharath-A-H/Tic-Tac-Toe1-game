// Import required modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const GameResult = require('./models/GameResult'); 

// Create an instance of express
const app = express();

// Define the port number
const port = 9001;

// Use CORS middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tictactoe', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected')) 
  .catch(err => console.log(err)); 

// Initialize the game state as an array of 9 nulls (empty board)
let gameState = Array(9).fill(null);
let player1 = 'Player 1';
let player2 = 'Player 2';

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Tic-Tac-Toe game API!');
});

// Define a route to get the current game state
app.get('/game-state', (req, res) => {
  res.json({ gameState, player1, player2 });
});

// Define a route to handle a move in the game
app.post('/make-move', (req, res) => {
  const { index, player } = req.body; 
  if (gameState[index] === null) { 
    gameState[index] = player; 

   // Check if there's a winner
    const winnerData = calculateWinner(gameState); 
    if (winnerData) { 
      const winner = winnerData.player; 
      const loser = winner === 'X' ? 'O' : 'X'; 
      const winnerName = winner === 'X' ? player1 : player2;
      const loserName = loser === 'X' ? player1 : player2;

      // Save the game result to the database
      const gameResult = new GameResult({
        winner: winnerName,
        loser: loserName,
        gameState
      });

      gameResult.save() // Save the game result to the database
        .then(() => res.json({ success: true, gameState, winner: winnerName })) 
        .catch(err => res.status(500).json({ success: false, error: err.message })); 
    } else {
      res.json({ success: true, gameState }); 
    }
  } else {
    res.json({ success: false }); 
  }
});

// Define a route to reset the game state
app.post('/reset', (req, res) => {
  gameState = Array(9).fill(null); 
  res.json({ success: true, gameState }); 
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Function to calculate the winner of the game
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
      return { player: squares[a], line: [a, b, c] }; // Return the winner and the winning line
    }
  }
  return null; // Return null if there's no winner
};
