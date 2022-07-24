import { useState } from "react";
import { ethers, BigNumber } from "ethers";

import Marketplace from "./contracts/Marketplace.json";
import BoredPetsNFT from "./contracts/BoredPetsNFT.json";

const MainMint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts[0]);

  async function handleMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const networkId = await provider.getNetwork().chainId;
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        BoredPetsNFT.networks[networkId].address,
        BoredPetsNFT.abi,
        signer
      );
      try {
        const response = await contract.mint(BigNumber.from(mintAmount));
        console.log("response: ", response);
      } catch (error) {
        console.log("error: ", error);
      }
    }
  }

  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };

  return (
    <div>
      <h1>RoboPunks</h1>
      <p>Mint RoboPunks to find out.</p>
      {isConnected ? (
        <div>
          <button onClick={handleDecrement}>-</button>
          <input type="number" value={mintAmount} />
          <button onClick={handleIncrement}>+</button>
          <button onClick={handleMint}>Mint Now</button>
        </div>
      ) : (
        <p>You must be connected to Mint.</p>
      )}
    </div>
  );
};

export default MainMint;
