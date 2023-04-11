import { setLogger, useQuery } from "react-query";
import { useMutation } from "react-query";
import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { betReducer, INITIAL_STATE } from "./betReducer";

const CryptoBetter = (props) => {
  //FETCH
  const fetchCrypto = async () => {
    const res = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD"
    );

    return res.data; //Hämtar USD objektet mot BTC från API
  };

  const { data, error, isLoading } = useQuery("usd", fetchCrypto);

  const [lastPrice, setLastPrice] = useState(0);

  const [price, setPrice] = useState(0);

  const [betAmount, setBetAmount] = useState(0);

  const [betType, setBetType] = useState("BTCUSD");

  const [payout, setPayout] = useState(0);

  const [win, setWin] = useState();

  const [status, setStatus] = useState(false); //ongoing bet

  const [higherOrLower, setHigherOrLower] = useState("");

  const [balance, setBalance] = useState(0);

  const [time, setTime] = useState(10);

  const [user, setUser] = useState({
    name: "",
    password: "",
    balance: 0,
    bets: [],
  });

  const [bet, dispatch] = useReducer(betReducer, INITIALSTATE);

  const checkWin = (lastPrice, price) => {
    let newPayout = 0;
    if (
      (lastPrice < price && higherOrLower === "higher") ||
      (lastPrice > price && higherOrLower === "lower")
    ) {
      console.log("VINST");
      newPayout = betAmount * 2;
      setStatus(false);
      setHigherOrLower("null");
      setPayout(newPayout);
      setWin(true);
    } else {
      console.log("FÖRLUST");
      newPayout = -betAmount * 2;
      setStatus(false);
      setHigherOrLower("null");
      setPayout(newPayout);
      setWin(false);
    }
  };

  const updatePrice = async () => {
    const result = await fetchCrypto();
    let prevPrice = price;
    setPrice(result.USD);
    setLastPrice(prevPrice);
  };

  useEffect(() => {
    setUser(props.CryptoBetter);
  }, [props]);

  useEffect(() => {
    const updateGameState = () => {
      checkWin(lastPrice, price);
      const newBalance = win ? user.balance + payout : user.balance - payout;
      setBalance(newBalance);
      updateUserBalance.mutate(newBalance); //DENNA MÅSTE ENDAST KÖRAS EFtER USER HAR LOGGAT IN
    };
    updatePrice();

    const interval = setInterval(() => {
      updatePrice();
      updateGameState();
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  function Timer() {
    useEffect(() => {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    return <h4> Remaining time: {time} seconds</h4>;
  }

  useEffect(() => {
    setTime(10);
  }, [price]);

  function WinLose({ win }) {
    if (win) {
      return <h4>Win!</h4>;
    } else if (!win) {
      return <h4>Lose!</h4>;
    } else {
      return <h4>No current bet.</h4>;
    }
  }

  //MUTATION
  const mutation = useMutation((bet) =>
    axios.post("http://localhost:9000/bets", bet, {
      headers: { "Content-Type": "application/json" },
    })
  );

  const updateUserBalance = useMutation((newBalance) =>
    axios.put(`http://localhost:9000/users/${user._id}`, {
      balance: newBalance,
      name: user.name,
      password: user.password,
    })
  );

  //ERROR HANDLING
  if (error) return <div>Request Failsdded</div>;
  if (isLoading) return <div>Loadisdsng...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    //if (user.balance > bet.betAmount && !bet.status) {
      setStatus(true);
      dispatch({
        type: "SET_BET",
        payload: { name: e.target.name, value: e.target.value },
      });

      const { data } = await mutation.mutateAsync(bet);

      let betsArray = []; //betsArray[0]._id

      if (user.bets) {
        betsArray = [...user.bets, data.bet];
      } else {
        betsArray = [data.bet];
      }

      const updatedUser = {
        ...user,
        bets: betsArray,
      };

      console.log(balance);
      setUser(updatedUser);

      console.log(bet);
  };

  const handleButtonClick = async (e) => {
    e.preventDefault()
  
    const newBetType = e.target.name === 'higherOrLower' ? 'BTCUSD' : 'ETHUSD';
    dispatch({
      type: "SET_BET",
      payload: { name: 'betType', value: newBetType },
    });
  

    
    await handleSubmit(e);
  };
  

  return (
    <div className="userstats">
      <h3>Balance: {balance}</h3>
      <Timer />
      <div className="currentvalue">
        <h4>BTC Price: ${price}</h4>
        <p>Do you think it will go higher or lower?</p>
        <div className="bet">
          <h2>Bet</h2>
          <form>
            <label>Bet Amount:</label>
            <input
              type="number"
              required
              value={bet.betAmount}
              name="betAmount"
              onChange={(e) =>
                dispatch({
                  type: "SET_BET",
                  payload: { name: e.target.name, value: e.target.value },
                })
              }
            />
            <label>Bet Type:</label>
            <select
              value={bet.betType}
              name="betType"
              onChange={(e) =>
                dispatch({
                  type: "SET_BET",
                  payload: { name: e.target.name, value: e.target.value },
                })
              }
            >
              <option value="BTCUSD">BTCUSD</option>
              <option value="ETHUSD">ETHUSD</option>
            </select>
            <button
              disabled={mutation.isLoading}
              value="higher"
              name="higherOrLower"
              onClick={handleButtonClick}
            >
              Higher
            </button>
            <button
              disabled={mutation.isLoading}
              value="lower"
              name="higherOrLower"
              onClick={handleButtonClick}
            >
              Lower
            </button>
          </form>
          {mutation.isError && (
            <div>There was an error: {mutation.error.message}</div>
          )}
          {mutation.isSuccess && <div>New bet added</div>}
        </div>
        <WinLose win={win} />
      </div>
    </div>
  );
};

export default CryptoBetter;
