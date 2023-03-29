import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import UserLogin from "./components/UserLogin"
import CryptoBetter from "./components/CryptoBetter";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <div className="pages">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/userlogin" element={<UserLogin />} />
              <Route path="/cryptobetter" element={<CryptoBetter />} />
            </Routes>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
