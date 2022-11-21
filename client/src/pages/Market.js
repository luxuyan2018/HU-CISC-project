import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  Tooltip,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { ethers } from "ethers";

import { getContracts, REJECT_TXN_TEXT, ImageModal } from "../tools";
import { NavBarButton, tooltip } from "../styling";

export default function Market({ isConnected, accounts }) {
  const [nfts, setNfts] = useState([]);
  const [isBuying, setIsBuying] = useState(false);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [currentNft, setCurrentNft] = useState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadNFTs();
  }, []);

  function handleShowFullImage(nft) {
    setCurrentNft(nft);
    onOpen();
  }

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
    setIsBuying(true);

    const { marketplace, boredPets } = await getContracts();

    try {
      const txn = await marketplace.buyNft(boredPets.address, tokenId, {
        value: price,
      });
      const rc = await txn.wait();
      const NFTSold = rc.events.find((event) => event.event === "NFTSold");
      console.log("NFTSold", NFTSold);

      toast({
        title: "NFT Bought",
        description: "You can go to Mine Page to check.",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top",
        container: {
          color: "pink.500",
          rounded: "20px",
        },
      });
    } catch (e) {
      console.log(e);

      toast({
        title: "Failed to Buy NFT",
        description: REJECT_TXN_TEXT,
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top",
        container: {
          color: "pink.500",
          rounded: "20px",
        },
      });
    }
    setIsBuying(false);

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
        {ImageModal(isOpen, onClose, currentNft?.image)}

        <Flex
          justify="space-evenly"
          align="center"
          padding="30px"
          flexDirection="row"
          flexWrap="wrap"
        >
          {nfts.map((nft, i) => (
            <Box marginBottom="30px" width="30%" align="center">
              <Image
                src={nft.image}
                boxSize="400px"
                onClick={() => handleShowFullImage(nft)}
              />
              <Text fontSize="30px" fontFamily="VT323">
                Name: {nft.name}
              </Text>
              <Text fontSize="30px" fontFamily="VT323">
                Description: {nft.description ? nft.description : "N/A"}
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
                      nft.seller.toLowerCase() === accounts[0].toLowerCase() ||
                      isBuying
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
