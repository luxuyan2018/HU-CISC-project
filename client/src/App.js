import "./App.css";
import { useState } from "react";
import MainMint from "./MainMint";
import NavBar from "./NavBar";
import MyAssets from "./my-nfts";
import Home from "./pages/Home";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [accounts, setAccounts] = useState([]);
  return (
    <div className="overlay">
      <div className="App">
        <Router>
          <NavBar accounts={accounts} setAccounts={setAccounts} />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route
              path="/mint"
              element={
                <MainMint accounts={accounts} setAccounts={setAccounts} />
              }
            />
            <Route
              path="/my-asset"
              element={
                <MyAssets accounts={accounts} setAccounts={setAccounts} />
              }
            />
          </Routes>
        </Router>
      </div>
      <div className="moving-background" />
    </div>
  );
}

export default App;
