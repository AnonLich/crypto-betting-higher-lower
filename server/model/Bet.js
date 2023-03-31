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
    type: Boolean,
  },
  higherOrLower: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Bet", betSchema);
