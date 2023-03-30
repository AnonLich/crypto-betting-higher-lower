import { useQuery } from "react-query";
import { useState } from "react";
import axios from "axios";


import UserLogin from "../components/UserLogin";
import CryptoBetter from "../components/CryptoBetter";

const Home = () => {

  const [user, setUser] = useState("");

  const getData = (data) => {
    setUser(data);
  };

  return (
    <div className="home">
      <div className="userlogin">
        <UserLogin onSubmit={getData} />
      </div>
      <div className="cryptobetter">
        <CryptoBetter CryptoBetter={ user }/>
      </div>
    </div>
  );
};

export default Home;
