import { setLogger, useQuery } from "react-query";
import { useMutation } from "react-query";
import { useState, useEffect } from "react";
import axios from "axios";

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

  const [remainingTime, setRemainingTime] = useState(0);

  const [user, setUser] = useState({
    name: "",
    password: "",
    balance: 0,
    bets: [],
  });

  const checkWin = (lastPrice, price) => {
    if (
      (lastPrice < price && higherOrLower === "higher") ||
      (lastPrice > price && higherOrLower === "lower")
    ) {
      setPayout(betAmount * 2);
      setStatus(false);
      setHigherOrLower("null");
      return true;
    } else {
      setPayout(betAmount * 2);
      setStatus(false);
      setHigherOrLower("null");
      return false;
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
      setWin(checkWin(lastPrice, price));
      const newBalance = win ? user.balance + payout : user.balance - payout;
      setBalance(newBalance);
      console.log(newBalance);
      updateUserBalance.mutate(newBalance); //DENNA MÅSTE ENDAST KÖRAS EFtER USER HAR LOGGAT IN

    };
    updatePrice();

    const interval = setInterval(() => {
      updatePrice();

      updateGameState();
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  function WinLose({ win }) {
    if (win) {
      return <div>Win!</div>;
    } else if (!win) {
      return <div>Lose!</div>;
    } else {
      return <div>No current bet.</div>;
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

    if (user.balance > betAmount) {
      setStatus(true);

      const bet = {
        betAmount,
        betType,
        payout,
        win,
        status,
        higherOrLower,
        user,
      };

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

      setUser(updatedUser);

      console.log(balance);

      console.log(bet);
    }
  };

  return (
    <div className="userstats">
      <h3>Balance: {balance}</h3>
      <h3>Remaining time: {remainingTime}</h3>
      <div className="currentvalue">
        <h4>BTC Price: ${price}</h4>
        <p>Do you think it will go higher or lower?</p>
        <div className="bet">
          <h2>Bet</h2>
          <form onSubmit={handleSubmit}>
            <label>Bet Amount:</label>
            <input
              type="number"
              required
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />
            <label>Bet Type:</label>
            <select
              value={betType}
              onChange={(e) => setBetType(e.target.value)}
            >
              <option value="BTCUSD">BTCUSD</option>
              <option value="ETHUSD">ETHUSD</option>
            </select>
            <button
              disabled={mutation.isLoading}
              value="higher"
              onClick={(e) => setHigherOrLower(e.target.value)}
            >
              Higher
            </button>
            <button
              disabled={mutation.isLoading}
              value="lower"
              onClick={(e) => setHigherOrLower(e.target.value)}
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
