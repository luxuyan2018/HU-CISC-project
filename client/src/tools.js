import { ethers } from "ethers";
import { Marketplace, HappyCatsNFT } from "./ContractsAddress";

export const getContracts = async () => {
  if (window.ethereum) {
    const networkId = await window.ethereum.request({
      method: "net_version",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    console.log(Marketplace, HappyCatsNFT, networkId);

    const marketplace = await new ethers.Contract(
      Marketplace.networks[networkId].address,
      Marketplace.abi,
      signer
    );

    const boredPets = await new ethers.Contract(
      HappyCatsNFT.networks[networkId].address,
      HappyCatsNFT.abi,
      signer
    );
    return { marketplace, boredPets };
  }
};
