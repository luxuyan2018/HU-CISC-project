import { useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { getContracts } from "../tools";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Heading,
  Stack,
  Container,
  AspectRatio,
} from "@chakra-ui/react";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function CreateItem(accounts) {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  //   const router = useRouter();
  console.log("formInput: ", formInput);

  async function onChange(e) {
    // upload image to IPFS
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) {
      return;
    } else {
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

  async function listNFTForSale() {
    const url = await uploadToIPFS();
    const { marketplace, boredPets } = await getContracts();

    let listingFee = await marketplace.getListingFee();
    listingFee = listingFee.toString();

    console.log("listingFee: ", listingFee);

    // boredPets.methods
    //   .mint(url)
    //   .send({ from: accounts[0] })
    //   .on("receipt", function (receipt) {
    //     console.log("minted");
    //     // List the NFT
    //     const tokenId = receipt.events.NFTMinted.returnValues[0];
    //     marketplace.methods
    //       .listNft(
    //         boredPetsAddress,
    //         tokenId,
    //         Web3.utils.toWei(formInput.price, "ether")
    //       )
    //       .send({ from: accounts[0], value: listingFee })
    //       .on("receipt", function () {
    //         console.log("listed");
    //         router.push("/");
    //       });
    //   });
  }

  const hasName = !!formInput.name;

  return (
    <Flex justify="space-evenly" align="center" padding="30px">
      <Box width="40%" align="left">
        <Text fontWeight="bold" fontSize="30px" marginBottom="50px">
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
            <AspectRatio ratio={3}>
              <Box
                position="relative"
                height="100%"
                width="100%"
                borderColor="white"
                borderStyle="dashed"
                display="flex"
                flexDirection="column"
                rounded="md"
                _hover={{
                  bg: "grey",
                }}
                borderWidth="6px"
              >
                <Text fontWeight="bold" fontSize="15px">
                  Drop images here
                </Text>
                <Text fontSize="10px">or click to upload</Text>
                <Input
                  type="file"
                  height="100%"
                  width="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  aria-hidden="true"
                  accept=".csv"
                />
              </Box>
            </AspectRatio>
          </Container>
        </Box>
        <Box>
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
      </Box>
    </Flex>
  );
}
