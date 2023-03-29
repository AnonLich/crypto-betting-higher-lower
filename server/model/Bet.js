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
  },
  win: {
    type: Boolean,
  },
  status: {
    type: String,
  },
});

module.exports = mongoose.model("Bet", betSchema);
