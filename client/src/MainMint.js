import { useState } from "react";

import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";

import { getContracts } from "./tools";

const MainMint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts[0]);

  async function handleMint() {
    if (window.ethereum) {
      const { marketplace, boredPets } = await getContracts();

      try {
        let listingFee = await marketplace.getListingFee();
        listingFee = listingFee.toString();
        console.log("response: ", listingFee);
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
    // <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
    <Flex align="center" justify="center" height="50vh">
      <Box width="520px">
        <div>
          <Text fontSize="48px" textShadow="0 5px #00000">
            RoboPunks
          </Text>
          <Text
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 2px 2px #00000"
          >
            Mint RoboPunks to find out.
          </Text>
        </div>
        {isConnected ? (
          <div>
            <Flex justify="center" align="center">
              <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                onClick={handleDecrement}
              >
                -
              </Button>
              <Input
                readOnly
                fontFamily="inherit"
                width="100px"
                height="40px"
                textAlign="center"
                paddingLeft="19px"
                marginTop="10px"
                type="number"
                value={mintAmount}
              />
              <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                onClick={handleIncrement}
              >
                +
              </Button>
            </Flex>
            <Button
              backgroundColor="#D6517D"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              marginTop="10px"
              onClick={handleMint}
            >
              Mint Now
            </Button>
          </div>
        ) : (
          <Text
            marginTop="70px"
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 3px #00000"
            color="#D6517D"
          >
            You must be connected to Mint.
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default MainMint;
