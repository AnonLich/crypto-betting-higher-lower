const mongoose = require("mongoose");

const MyObjectId = mongoose.Types.ObjectId;

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
  bet: {
    type: [MyObjectId]
  }
});

module.exports = mongoose.model("User", userSchema);
