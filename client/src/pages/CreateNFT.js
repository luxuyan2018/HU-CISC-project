import { useState } from "react";
import { create } from "ipfs-http-client";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Container,
  AspectRatio,
  useToast,
  Tooltip,
} from "@chakra-ui/react";

import { Buffer } from "buffer";

import { getContracts } from "../tools";
import { NavBarButton, tooltip } from "../styling";

const projectId = "2CjWjaYkeZ5zvwHEYDfVVWVW6Zx";
const projectSecret = "ce5a56fb5fcf5a01002c05ad5c271a00";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

// const client = create("https://ipfs.infura.io:5001/api/v0");

export default function CreateItem({ isConnected }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  async function onDropFile(e) {
    // upload image to IPFS
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const pinned = await client.pin.add(added.path);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  function handleClearFile() {
    setFileUrl("");
  }

  function clearFormInput() {
    updateFormInput({
      price: "",
      name: "",
      description: "",
    });
  }

  async function uploadMetaDataToIPFS() {
    const { name, description } = formInput;
    if (canMint) {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name,
        description,
        image: fileUrl,
      });
      try {
        const added = await client.add(data);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction
        return url;
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  }

  const toast = useToast();
  async function mint() {
    const url = await uploadMetaDataToIPFS();

    const { marketplace, boredPets } = await getContracts();

    const txn = await boredPets.mint(url);
    const rc = await txn.wait();
    const NFTMinted = rc.events.find((event) => event.event === "NFTMinted");
    console.log("NFTMinted", NFTMinted);

    const tokenId = NFTMinted.args[0].toNumber();
    const txn2 = await marketplace.createNft(boredPets.address, tokenId);
    const rc2 = await txn2.wait();
    const NFTCreated = rc2.events.find((event) => event.event === "NFTCreated");
    console.log("NFTCreated", NFTCreated);

    toast({
      title: "NFT Minted",
      description: "NFT minted, you can go to My Asset to check.",
      status: "success",
      duration: 1000,
      isClosable: true,
      position: "top",
      container: {
        color: "pink.500",
        rounded: "20px",
      },
    });
    handleClearFile();
    clearFormInput();
  }

  const hasName = !!formInput.name;
  const canMint = !!formInput.name && fileUrl;

  return !isConnected ? (
    <Text fontSize="30px" fontFamily="VT323">
      Connect to explore more.
    </Text>
  ) : (
    <Flex justify="space-evenly" align="center">
      <Box width="40%" align="left">
        <Text fontWeight="bold" fontSize="30px" marginBottom="30px">
          Mint NFT
        </Text>
        <Box marginBottom="30px">
          <Flex>
            <Text fontSize="15px" marginTop="0" marginBottom="10px">
              Image, Video or Audio
            </Text>
            <Text color="red" marginTop="0" marginBottom="10px">
              *
            </Text>
          </Flex>
          <Text
            fontSize="20px"
            fontFamily="VT323"
            marginTop="0"
            marginBottom="10px"
          >
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3. Max size:
            100 MB
          </Text>
          <Container>
            <AspectRatio ratio={3.5}>
              <Box
                position="relative"
                height="100%"
                width="100%"
                borderColor="white"
                borderStyle="dashed"
                display="flex"
                flexDirection="column"
                _hover={{
                  bg: "grey",
                }}
                borderWidth="3px"
                rounded={30}
              >
                {fileUrl ? (
                  <Box
                    height="100%"
                    width="100%"
                    position="absolute"
                    backgroundSize="cover"
                    backgroundRepeat="no-repeat"
                    backgroundPosition="center"
                    backgroundImage={fileUrl}
                  >
                    <Button
                      size="md"
                      fontSize="30px"
                      borderRadius="10px"
                      padding="10px"
                      paddingBottom="20px"
                      top="10px"
                      right="10px"
                      position="absolute"
                      backgroundColor="#D53F8C"
                      zIndex={1}
                      onClick={handleClearFile}
                    >
                      &#10007;
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Text fontWeight="bold" fontSize="15px">
                      Drop images here
                    </Text>
                    <Text fontSize="10px">or click to upload</Text>
                  </Box>
                )}
                <Input
                  type="file"
                  height="100%"
                  width="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  aria-hidden="true"
                  accept="image/*"
                  onChange={onDropFile}
                  // onClick and onDrop make select (drop) same file work
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  onDrop={(event) => {
                    event.target.value = null;
                  }}
                />
              </Box>
            </AspectRatio>
          </Container>
        </Box>
        <Box marginBottom="30px">
          <Flex>
            <Text fontSize="15px" marginTop="0" marginBottom="10px">
              Asset Name
            </Text>
            <Text color="red" marginTop="0" marginBottom="10px">
              *
            </Text>
          </Flex>
          <Input
            marginTop="0"
            marginBottom="10px"
            fontFamily="inherit"
            borderRadius="10px"
            height="40px"
            width="100%"
            textAlign="left"
            type="text"
            placeholder="Enter Name"
            borderColor={hasName ? "black" : "red"}
            value={formInput.name}
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          {hasName ? (
            <Text marginTop="0" marginBottom="10px">
              Enter the name for your asset.
            </Text>
          ) : (
            <Text color="red" marginTop="0" marginBottom="10px">
              Asset Name is required.
            </Text>
          )}
        </Box>
        <Box marginBottom="30px">
          <Text fontSize="15px" marginTop="0" marginBottom="10px">
            Description
          </Text>
          <Input
            marginTop="0"
            marginBottom="10px"
            fontFamily="inherit"
            borderRadius="10px"
            height="40px"
            width="100%"
            textAlign="left"
            type="text"
            placeholder="Enter Description"
            value={formInput.description}
            spellCheck
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
        </Box>
        <Tooltip
          label={canMint ? undefined : "Fill in required fields to mint"}
          placement="right"
          {...tooltip}
        >
          <Button {...NavBarButton} onClick={mint} disabled={!canMint}>
            Mint
          </Button>
        </Tooltip>
      </Box>
    </Flex>
  );
}
