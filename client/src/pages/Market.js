import { useEffect, useState } from "react";
import { Box, Button, Flex, Text, Image, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import { ethers } from "ethers";

import { getContracts } from "../tools";
import { NavBarButton, tooltip } from "../styling";

export default function Market({ isConnected, accounts }) {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const { marketplace, boredPets } = await getContracts();

    const data = await marketplace.getListedNfts.call();

    const nfts = await Promise.all(
      data.map(async (i) => {
        try {
          const tokenURI = await boredPets.tokenURI(i.tokenId);
          const meta = await axios.get(tokenURI);
          let nft = {
            listed: i.listed,
            price: i.price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
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

  async function buyNFT(tokenId, price) {
    const { marketplace, boredPets } = await getContracts();
    const txn = await marketplace.buyNft(boredPets.address, tokenId, {
      value: price,
    });
    const rc = await txn.wait();
    const NFTSold = rc.events.find((event) => event.event === "NFTSold");
    console.log("NFTSold", NFTSold);

    await loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl">No NFTs listed on market</h1>;
  } else {
    return !isConnected ? (
      <Text fontSize="30px" fontFamily="VT323">
        Connect to explore more.
      </Text>
    ) : (
      <Flex flexDirection="column">
        <Text fontSize="30px" align="left" marginLeft="5%">
          NFTs for Sale:
        </Text>
        <Flex
          justify="space-evenly"
          align="center"
          padding="30px"
          flexDirection="row"
          flexWrap="wrap"
        >
          {nfts.map((nft, i) => (
            <Box marginBottom="30px" width="30%">
              <Image src={nft.image} boxSize="md" fit="none" />
              <Text fontSize="30px" fontFamily="VT323">
                Name: {nft.name}
              </Text>
              <Text fontSize="30px" fontFamily="VT323">
                Description: {nft.description ? nft.name : "N/A"}
              </Text>
              <Box>
                <Text fontSize="30px" fontFamily="VT323">
                  Price - {ethers.utils.formatEther(nft.price)} Eth
                </Text>
                <Tooltip
                  label={
                    !accounts[0] ||
                    nft.seller.toLowerCase() === accounts[0].toLowerCase()
                      ? "You own this NFT"
                      : undefined
                  }
                  placement="right"
                  {...tooltip}
                >
                  <Button
                    {...NavBarButton}
                    onClick={() => buyNFT(nft.tokenId, nft.price)}
                    disabled={
                      !accounts[0] ||
                      nft.seller.toLowerCase() === accounts[0].toLowerCase()
                    }
                  >
                    Buy
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Flex>
      </Flex>
    );
  }
}
