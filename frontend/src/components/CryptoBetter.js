import { useQuery } from "react-query";
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
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const updatePrice = async () => {
      const result = await fetchCrypto();
      setPrice(result.USD);
    };

    const interval = setInterval(updatePrice, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchBet = async () => {
    const res = await axios.get("http://localhost:9000/bets/");
    return res.data.bets;
  };
  const {
    data: betData,
    error: betError,
    isLoading: betIsLoading,
  } = useQuery("bets", fetchBet);

  //SETTERS
  const [betAmount, setBetAmount] = useState(0);
  const [betType, setBetType] = useState("BTCUSD");
  const [payout, setPayout] = useState(0);
  const [win, setWin] = useState();
  const [status, setStatus] = useState("");
  const [higherOrLower, setHigherOrLower] = useState("");
  const [user, setUser] = useState("");

  //MUTATION
  const mutation = useMutation((bet) =>
    axios.post("http://localhost:9000/bets", bet, {
      headers: { "Content-Type": "application/json" },
    })
  );

  //ERROR HANDLING
  if (error) return <div>Request Failsdded</div>;
  if (isLoading) return <div>Loadisdsng...</div>;



  const calculatePayout = () => {
    if (win) {
      setPayout(betAmount * 2);
    } else {
      setPayout(betAmount / 2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(props);
    console.log(props);
    const bet = {
      betAmount,
      betType,
      payout,
      win,
      status,
      higherOrLower,
      user,
    };
    console.log(bet);
    mutation.mutate(bet);
  };

  return (
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
          <select value={betType} onChange={(e) => setBetType(e.target.value)}>
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
    </div>
  );
};

export default CryptoBetter;
