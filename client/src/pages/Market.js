import React from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";

function Market() {
  return (
    <Flex align="center" justify="center" height="50vh">
      <Box width="520px">
        <Text fontSize="48px" textShadow="0 5px #00000">
          Market Page
        </Text>
        <Text
          fontSize="30px"
          letterSpacing="-5.5%"
          fontFamily="VT323"
          textShadow="0 2px 2px #00000"
        >
          Connect to explore more.
        </Text>
      </Box>
    </Flex>
  );
}

export default Market;
