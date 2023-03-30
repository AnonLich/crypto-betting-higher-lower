const User = require("../model/User");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return next(err);
  }
  if (!users) {
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(200).json({ users });
};

const addUser = async (req, res, next) => {
  const { name, password, balance, bets } = req.body;
  if (!name && name.trim() == "" && !password && password.length > 6) {
    return res.status(422).json({ message: "Invalid Data " });
  }

  let user;

  try {
    user = new User({
      name,
      password,
      balance,
      bets,
    });
    user = await user.save();
  } catch (err) {
    return next(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unable to save user" });
  }
  return res.status(201).json({ user });
};

const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, password, balance, bets } = req.body;
  if (!name && name.trim() == "" && !password && password.length > 6) {
    return res.status(422).json({ message: "Invalid Data " });
  }

  let user;

  try {
    user = await User.findByIdAndUpdate(id, { name, password, balance, bets })
      .populate("bets")
      .exec();
  } catch (err) {
    return next(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unable to save user" });
  }
  return res.status(200).json({ message: "Updated succesfully" });
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  let user;

  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    return next(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ message: "Succesfully deleted" });
};

const getUserById = async (req, res, next) => {
  const id = req.params.id;

  let user;

  try {
    user = await User.findById(id)
      .populate("bets")

      .exec();
  } catch (err) {
    return next(err);
  }
  if (!user) {
    return res.status(404).json({ message: "Did not find user" });
  }
  return res.status(200).json({ user });
};

exports.getAllUsers = getAllUsers;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserById = getUserById;
