const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  balance: {
    type: Number,
    required: true,
  },
  bets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bet",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
