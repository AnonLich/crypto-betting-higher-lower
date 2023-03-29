const express = require("express");
const {
  getAllBets,
  addBet,
  updateBet,
  deleteBet,
  getBetById,
} = require("../controller/bet-controller");

const router = express.Router();

router.get("/", getAllBets);
router.post("/", addBet);
router.put("/:id", updateBet);
router.delete("/:id", deleteBet);
router.get("/:id", getBetById);

module.exports = router;
