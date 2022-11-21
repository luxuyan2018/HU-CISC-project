import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Tooltip,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { ethers } from "ethers";

import { getContracts, REJECT_TXN_TEXT, ImageModal } from "../tools";
import { NavBarButton, tooltip } from "../styling";

export default function MyAssets({ isConnected }) {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [nftPrice, setNftPrice] = useState({});
  const [isListing, setIsListing] = useState(false);
  const [currentNft, setCurrentNft] = useState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const { marketplace, boredPets } = await getContracts();

    const data = await marketplace.getMyNfts.call();

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
    console.log(nfts);
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingState("loaded");
  }

  async function listNFT(tokenId, price) {
    setIsListing(true);
    const { marketplace, boredPets } = await getContracts();
    let listingFee = await marketplace.getListingFee();
    listingFee = listingFee.toString();
    console.log("listing fee", listingFee);

    try {
      const txn = await marketplace.listNft(
        boredPets.address,
        tokenId,
        ethers.utils.parseEther(price),
        {
          value: listingFee,
        }
      );
      const rc = await txn.wait();
      const NFTListed = rc.events.find((event) => event.event === "NFTListed");
      console.log("NFTListed", NFTListed);

      await loadNFTs();

      toast({
        title: "NFT Listed",
        description: "You can go to Market Page to check.",
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
        title: "Failed to List NFT",
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
    setIsListing(false);
  }

  function handleShowFullImage(nft) {
    setCurrentNft(nft);
    onOpen();
  }

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  } else {
    return !isConnected ? (
      <Text fontSize="30px" fontFamily="VT323">
        Connect to explore more.
      </Text>
    ) : (
      <Flex flexDirection="column">
        {/* popup image */}
        {ImageModal(isOpen, onClose, currentNft?.image)}

        <Text fontSize="30px" align="left" marginLeft="5%">
          My NFTs:
        </Text>
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
                {nft.listed ? (
                  <Text fontSize="30px" fontFamily="VT323">
                    Price - {ethers.utils.formatEther(nft.price)} Eth
                  </Text>
                ) : (
                  <InputGroup width="80%">
                    <InputLeftAddon backgroundColor="pink.500" children="Eth" />
                    <Input
                      fontFamily="inherit"
                      borderRadius="10px"
                      textAlign="left"
                      type="number"
                      placeholder="Enter Price"
                      width="60%"
                      value={nftPrice[nft.tokenId]}
                      onChange={(e) => {
                        setNftPrice({ [nft.tokenId]: e.target.value });
                      }}
                    />
                    <Tooltip
                      label={
                        nftPrice[nft.tokenId]
                          ? undefined
                          : "Fill in required fields to mint"
                      }
                      placement="bottom"
                      {...tooltip}
                    >
                      <Button
                        {...NavBarButton}
                        onClick={() =>
                          listNFT(nft.tokenId, nftPrice[nft.tokenId])
                        }
                        disabled={!nftPrice[nft.tokenId] || isListing}
                      >
                        List
                      </Button>
                    </Tooltip>
                  </InputGroup>
                )}
              </Box>
            </Box>
          ))}
        </Flex>
      </Flex>
    );
  }
}
