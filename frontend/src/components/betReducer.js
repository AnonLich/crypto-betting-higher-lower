export const INITIAL_STATE = {
  betAmount: 0,
  betType: "",
  payout: 0,
  win: false,
  status: false,
  higherOrLower: "",
  user: {
    name: "",
    password: "",
    balance: 0,
    bets: [],
  },
};

const betReducer = (state, action) => {
  switch (action.type) {
    case "SET_BET":
      return {
        ...state,
        [action.payload.name]:action.payload.value
      };
    default:
      return state;
  }
};

export default betReducer;


