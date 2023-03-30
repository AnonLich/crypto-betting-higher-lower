const Bet = require("../model/Bet");

const getAllBets = async (req, res, next) => {
  let bets;
  try {
    bets = await Bet.find();
  } catch (err) {
    return next(err);
  }
  if (!bets) {
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(200).json({ bets });
};

const addBet = async (req, res, next) => {
  const { betAmount, betType, payout, win, status, higherOrLower } = req.body;
  if (!betType && betType.trim() == "" && !betAmount && betAmount.length > 1) {
    return res.status(422).json({ message: "Invalid Data " });
  }

  let bet;

  try {
    bet = new Bet({
      betAmount,
      betType,
      payout,
      win,
      status,
      higherOrLower,
    });
    bet = await bet.save();
  } catch (err) {
    return next(err);
  }
  if (!bet) {
    return res.status(500).json({ message: "Unable to save user" });
  }
  return res.status(201).json({ bet });
};

const updateBet = async (req, res, next) => {
  const id = req.params.id;
  const { betAmount, betType, payout, win, status, higherOrLower } = req.body;
  if (!betType && betType.trim() == "" && !betAmount && betAmount.length > 1) {
    return res.status(422).json({ message: "Invalid Data " });
  }

  let bet;

  try {
    bet = await Bet.findByIdAndUpdate(id, {
      betAmount,
      betType,
      payout,
      win,
      status,
      higherOrLower,
    });
  } catch (err) {
    return next(err);
  }
  if (!bet) {
    return res.status(500).json({ message: "Unable to save user" });
  }
  return res.status(200).json({ message: "Updated succesfully" });
};

const deleteBet = async (req, res, next) => {
  const id = req.params.id;

  let bet;

  try {
    bet = await Bet.findByIdAndRemove(id);
  } catch (err) {
    return next(err);
  }
  if (!bet) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ message: "Succesfully deleted" });
};

const getBetById = async (req, res, next) => {
  const id = req.params.id;

  let bet;

  try {
    bet = await Bet.findById(id)

  } catch (err) {
    return next(err);
  }
  if (!bet) {
    return res.status(404).json({ message: "Did not find user" });
  }
  return res.status(200).json({ user });
};

exports.getAllBets = getAllBets;
exports.addBet = addBet;
exports.updateBet = updateBet;
exports.deleteBet = deleteBet;
exports.getBetById = getBetById;
