const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
  winner: {
    type: String,
    required: true,
  },
  loser: {
    type: String,
    required: true,
  },
  gameState: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('GameResult', gameResultSchema);
