import React from "react";
import { Link as ReactLink } from "react-router-dom";
import { Box, Button, Flex, Image, Link, Tooltip } from "@chakra-ui/react";

import Facebook from "./assets/social-media-icons/facebook_32x32.png";
import Twitter from "./assets/social-media-icons/twitter_32x32.png";
import Email from "./assets/social-media-icons/email_32x32.png";
import { NavBarButton, tooltip } from "./styling";

const NOT_CONNECT_TOOLTIP = "Connect to explore";

const NavBar = ({ isConnected, accounts, setAccounts }) => {
  async function connectAccount() {
    if (window.ethereum) {
      // metamask will inject to here
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    }
  }

  return (
    <Flex justify="space-between" align="center" padding="30px">
      {/* left side bar */}
      <Flex justify="space-around" width="25%" padding="0 75px">
        <Link href="https://www.facebook.com">
          <Image src={Facebook} boxSize="42px" margin="0 15px" />
        </Link>
        <Link href="https://www.twitter.com">
          <Image src={Twitter} boxSize="42px" margin="0 15px" />
        </Link>
        <Link href="https://www.gmail.com">
          <Image src={Email} boxSize="42px" margin="0 15px" />
        </Link>
      </Flex>

      {/* right side bar */}
      <Flex justify="space-around" align="center" width="45%" padding="30px">
        <ReactLink to="/" style={{ textDecoration: "none" }}>
          <Button {...NavBarButton}>Home</Button>
        </ReactLink>

        <ReactLink to="/market" style={{ textDecoration: "none" }}>
          <Tooltip
            label={isConnected ? undefined : NOT_CONNECT_TOOLTIP}
            placement="bottom"
            {...tooltip}
          >
            <Button {...NavBarButton} isDisabled={!isConnected}>
              Market
            </Button>
          </Tooltip>
        </ReactLink>

        <ReactLink to="/mint" style={{ textDecoration: "none" }}>
          <Tooltip
            label={isConnected ? undefined : NOT_CONNECT_TOOLTIP}
            placement="bottom"
            {...tooltip}
          >
            <Button {...NavBarButton} isDisabled={!isConnected}>
              Mint
            </Button>
          </Tooltip>
        </ReactLink>

        <ReactLink to="/my-asset" style={{ textDecoration: "none" }}>
          <Tooltip
            label={isConnected ? undefined : NOT_CONNECT_TOOLTIP}
            placement="bottom"
            {...tooltip}
          >
            <Button {...NavBarButton} isDisabled={!isConnected}>
              My Asset
            </Button>
          </Tooltip>
        </ReactLink>

        {/* Connect */}
        {isConnected ? (
          <Box margin="0 15px">Connected</Box>
        ) : (
          <Button {...NavBarButton} onClick={connectAccount}>
            Connect
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;
