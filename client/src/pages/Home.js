import React from "react";
import { Box, Flex, Text, Image } from "@chakra-ui/react";

import spacecraft from "../assets/spacecraft2.gif";
import house from "../assets/house.gif";
import machine from "../assets/machine.webp";

function Home() {
  return (
    <Flex align="center" justify="center" flexDirection="column">
      <Text fontSize="40px" mt="100px">
        NFT Marketplace
      </Text>
      <Text fontSize="20px">Trade, mint, and manage NFTs</Text>

      <Flex
        justify="space-between"
        x
        align="center"
        padding="30px"
        flexDirection="row"
        flexWrap="wrap"
        w="60%"
        mt="50px"
        mb="50px"
      >
        <Box width="30%" align="center">
          <Image src={spacecraft} boxSize="300px" />
        </Box>
        <Box width="30%" align="center">
          <Image src={house} boxSize="300px" />
        </Box>
        <Box width="30%" align="center">
          <Image src={machine} boxSize="300px" />
        </Box>
      </Flex>

      <Text fontSize="30px" fontFamily="VT323">
        Connect your MetaMast wallet to explore more!
      </Text>
    </Flex>
  );
}

export default Home;
