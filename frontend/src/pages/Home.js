import { useQuery } from "react-query";
import { useState } from "react";

import UserLogin from "../components/UserLogin";
import CryptoBetter from "../components/CryptoBetter";

const Home = () => {
  const fetchUsers = async () => {
    const res = await fetch("/users");
    const json = await res.json();
    return json.users;
  };

  const [hasGetDataBeenCalled, setHasGetDataBeenCalled] = useState(false);

  const getData = (data) => {
    console.log(data);
    setHasGetDataBeenCalled(true);
  };

  const { data, error, isLoading } = useQuery("users", fetchUsers);

  if (error) return <div>Request Failed</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="home">
      <div className="userlogin">
        <UserLogin onSubmit={getData} />
      </div>
      <div className="cryptobetter">
        <CryptoBetter />
      </div>
    </div>
  );
};

export default Home;
