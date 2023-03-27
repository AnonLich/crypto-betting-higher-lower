import { useQuery } from "react-query";

const Home = () => {
  const fetchUsers = async () => {
    const res = await fetch("/users");
    const json = await res.json();
    return json.users;
  };

  const { data, error, isLoading } = useQuery("users", fetchUsers);

  if (error) return <div>Request Failed</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="home">
      <div className="users">
        {data.map((user) => (
          <p key={user._id}>{user.name}</p>
        ))}
      </div>
    </div>
  );
};

export default Home;
