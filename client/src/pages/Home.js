import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

function Home() {
  return (
    <Flex align="center" justify="center" height="50vh">
      <Box width="800px">
        <Text fontSize="40px">NFT Marketplace</Text>
        <Text fontSize="30px" fontFamily="VT323">
          Connect your MetaMast wallet to explore more.
        </Text>
      </Box>
    </Flex>
  );
}

export default Home;
