import React from "react";
import {
  Button,
  Flex,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Image,
  Text,
  useClipboard,
  Avatar,
} from "@chakra-ui/react";

import MetaMask from "./assets/MetaMask.png";
import userIcon from "./assets/userIcon.webp";

import { AiOutlineWallet } from "react-icons/ai";

export default function Sidebar({
  NavBarButton,
  isConnected,
  account,
  connectAccount,
  disConnectAccount,
  setTransparent,
  scrollTrigger,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { hasCopied, onCopy } = useClipboard(account);

  const btnRef = React.useRef();

  function handleOpen() {
    setTransparent(false);
    onOpen();
  }

  function handleClose() {
    scrollTrigger();
    onClose();
  }

  return (
    <Flex>
      <IconButton
        {...NavBarButton}
        fontSize="40px"
        icon={<AiOutlineWallet />}
        onClick={handleOpen}
      />

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={handleClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent fontFamily="VT323" mt="100px" backgroundColor="pink.800">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white" fontSize="30px">
            <Flex>
              <Avatar
                // name="Unknown User"
                backgroundColor="white"
                size="lg"
                src={userIcon}
              ></Avatar>
              <Text m="3%" ml="10%">
                My Wallet
              </Text>
            </Flex>
          </DrawerHeader>
          <DrawerBody mt="10%">
            {/* Connect */}
            <Flex mb="15px">
              <Flex flexDirection="row" flexWrap="wrap">
                <Image src={MetaMask} w="68%" />
                <Button
                  {...NavBarButton}
                  onClick={isConnected ? disConnectAccount : connectAccount}
                  w="20%"
                  ml="10%"
                >
                  {isConnected ? "Log Out" : "Connect"}
                </Button>
              </Flex>
            </Flex>
            {isConnected && (
              <Flex>
                <Text color="white" fontSize="23px" width="70%" mt="5px">
                  Acc #: {account.slice(0, 6)}...{account.slice(-4)}
                </Text>
                <Button {...NavBarButton} onClick={onCopy} w="20%" ml="10%">
                  {hasCopied ? "Copied" : "Copy"}
                </Button>
              </Flex>
            )}
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
