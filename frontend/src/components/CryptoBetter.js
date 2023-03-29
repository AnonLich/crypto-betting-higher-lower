import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { useState, useEffect } from "react";

const CryptoBetter = () => {
  //FETCH
  const fetchCrypto = async () => {
    const res = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD"
    );

    const json = await res.json();
    return json; //Hämtar USD objektet mot BTC från API
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
    const res = await fetch("/bets");
    const json = await res.json();
    return json.bets;
  };
  const { data: betData, error: betError, isLoading: betIsLoading } = useQuery("bets", fetchBet);

  //SETTERS
  const [betAmount, setBetAmount] = useState(0);
  const [betType, setBetType] = useState("BTCUSD");
  const [payout, setPayout] = useState(0);
  const [win, setWin] = useState("");
  const [status, setStatus] = useState("");

  //MUTATION
  const mutation = useMutation((bet) =>
    fetch("./bets/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bet),
    })
  );

  //ERROR HANDLING
  if (error) return <div>Request Failed</div>;
  if (isLoading) return <div>Loading...</div>;

  const calculatePayout = () => {
    if (win) {
      setPayout(betAmount * 2);
    } else {
      setPayout(betAmount / 2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bet = { betAmount, betType, payout, win, status };
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
          <button disabled={mutation.isLoading}>Add bet</button>
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
