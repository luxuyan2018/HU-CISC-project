import { useEffect, useState } from "react";
import { Box, Button, Flex, Input, Text, Image } from "@chakra-ui/react";
import axios from "axios";
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

    const data = await marketplace.getMyNfts.call({ from: accounts[0] });

    console.log("data", data);

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
            owner: i.buyer,
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
    console.log(nfts);
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingState("loaded");
  }

  async function listNFT(tokenId, price) {
    const { marketplace, boredPets } = await getContracts();
    let listingFee = await marketplace.getListingFee();
    listingFee = listingFee.toString();
    console.log("listing fee", listingFee);
    await marketplace.listNft(boredPets.address, tokenId, price, {
      value: listingFee,
    });
    await loadNFTs();
  }

  console.log("nfts", nfts);

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  } else {
    return (
      <Flex
        justify="space-evenly"
        align="center"
        padding="30px"
        flexDirection="row"
        flexWrap="wrap"
      >
        {nfts.map((nft, i) => (
          <Box marginBottom="30px" width="30%">
            <Image src={nft.image} boxSize="lg" fit="none" />
            <Text fontSize="30px" fontFamily="VT323">
              Name: {nft.name}
            </Text>
            <Text fontSize="30px" fontFamily="VT323">
              Description: {nft.description ? nft.name : "N/A"}
            </Text>
            <Box>
              {nft.listed ? (
                <Text fontSize="30px" fontFamily="VT323">
                  Price - {ethers.utils.formatEther(nft.price)} Eth
                </Text>
              ) : (
                <Button
                  {...NavBarButton}
                  onClick={() => listNFT(nft.tokenId, 100)}
                >
                  List
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Flex>
    );
  }
}
