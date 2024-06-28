const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameResultSchema = new Schema({
  winner: { type: String, required: true },
  loser: { type: String, required: true },
  gameState: { type: [String], required: true },
  date: { type: Date, default: Date.now }
});

const GameResult = mongoose.model('GameResult', gameResultSchema);
module.exports = GameResult;
