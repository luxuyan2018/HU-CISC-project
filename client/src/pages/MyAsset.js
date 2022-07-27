import { useEffect, useState } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
// import axios from "axios";
import { ethers } from "ethers";

import { getContracts } from "../tools";
import { NavBarButton } from "../styling";

export default function MyAssets({ accounts }) {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const { marketplace, boredPets } = await getContracts();

    let listingFee = await marketplace.getListingFee();
    console.log("response: ", listingFee);

    const data = await marketplace.getMyNfts.call({ from: accounts[0] });

    console.log(data);

    const nfts = await Promise.all(
      data.map(async (i) => {
        try {
          const tokenURI = await boredPets.tokenURI(i.tokenId);
          //   const meta = await axios.get(tokenURI);
          let nft = {
            price: i.price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            // image: meta.data.image,
            // name: meta.data.name,
            // description: meta.data.description,
            tokenURI: tokenURI,
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingState("loaded");
  }

  function listNFT(nft) {}

  console.log("nfts", nfts);

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  } else {
    return (
      <Flex justify="space-evenly" align="center" padding="30px">
        {nfts.map((nft, i) => (
          <div key={i} className="border shadow rounded-xl overflow-hidden">
            {/* <img src={nft.image} className="rounded" />
            <div className="p-4">
              <p style={{ height: "64px" }} className="text-2xl font-semibold">
                {nft.name}
              </p>
              <div style={{ height: "70px", overflow: "hidden" }}>
                <p className="text-gray-400">{nft.description}</p>
              </div>
            </div> */}
            <div>
              <Text fontSize="30px" fontFamily="VT323" marginBottom="5px">
                Price - {ethers.utils.formatEther(nft.price)} Eth
              </Text>
              <Button {...NavBarButton} onClick={() => listNFT(nft)}>
                List
              </Button>
            </div>
          </div>
        ))}
      </Flex>
    );
  }
}
