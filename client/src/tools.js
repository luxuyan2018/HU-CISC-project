import { ethers } from "ethers";

import Marketplace from "./contracts/Marketplace.json";
import BoredPetsNFT from "./contracts/BoredPetsNFT.json";

export const getContracts = async () => {
  if (window.ethereum) {
    const networkId = await window.ethereum.request({
      method: "net_version",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const marketplace = await new ethers.Contract(
      Marketplace.networks[networkId].address,
      Marketplace.abi,
      signer
    );

    const boredPets = await new ethers.Contract(
      BoredPetsNFT.networks[networkId].address,
      BoredPetsNFT.abi,
      signer
    );
    return { marketplace, boredPets };
  }
};
