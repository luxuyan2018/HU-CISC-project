import "./App.css";
import { useState } from "react";
import NavBar from "./NavBar";
import MyAssets from "./pages/MyAsset";
import Home from "./pages/Home";
import Market from "./pages/Market";
import CreateItem from "./pages/CreateNFT";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

function App() {
  const [accounts, setAccounts] = useState([]);
  return (
    <div className="overlay">
      <div className="App">
        <ChakraProvider>
          <Router>
            <NavBar accounts={accounts} setAccounts={setAccounts} />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route
                path="/market"
                element={
                  <Market accounts={accounts} setAccounts={setAccounts} />
                }
              />
              <Route
                path="/mint"
                element={
                  <CreateItem accounts={accounts} setAccounts={setAccounts} />
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
        </ChakraProvider>
      </div>
      <div className="moving-background" />
    </div>
  );
}

export default App;
