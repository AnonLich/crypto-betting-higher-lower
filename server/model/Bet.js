const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const betSchema = new Schema({
  betAmount: {
    type: Number,
    required: true,
  },
  betType: {
    type: String,
    required: true,
  },
  payout: {
    type: Number,
    required: true,
  },
  win: {
    type: Bool,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bet", betSchema);
