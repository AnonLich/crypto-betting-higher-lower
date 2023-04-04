import { useMutation } from "react-query";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

const UserLogin = (props) => {
  //To-Do  - Loginscreen,
  //Endast när man är inloggad ska man kunna göra ett bet, det här bettet ska sparas på kontots historik
  //fetchusers nedanför är därför inte använt än

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:9000/users");
    return res.data.users;
  };

  const { data, error, isLoading } = useQuery("users", fetchUsers);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (foundUser) {
      // check if foundUser is not null
      setBalance(foundUser.balance);
      console.log("FOUND");
      console.log(foundUser);
    }
  }, [foundUser, balance]);


  const handleSubmit = (e) => {
    e.preventDefault();
    const loginUser = { name, password };
    console.log(data);

    data.forEach((user) => {
      if (
        user.name === loginUser.name &&
        user.password === loginUser.password
      ) {
        setFoundUser(user);
      }
    });

    if (foundUser) {
      console.log("Logged in!");
      setLoggedIn(true);
      setUserId(foundUser._id);
      props.onSubmit(foundUser);
    } else console.log("Wrong credentials");
  };

  return (
    <>
      {!loggedIn ? (
        <div className="userlogin">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label>Username:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Password:</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button disabled={isLoading}>Login</button>
          </form>
        </div>
      ) : (
        <div className="stats">
          <div>
            Hello {foundUser.name}, your current balance is: {balance}.
          </div>
        </div>
      )}
    </>
  );
};

export default UserLogin;
