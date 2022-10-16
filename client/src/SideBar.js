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
} from "@chakra-ui/react";

import MetaMask from "./assets/MetaMask.png";

import { AiOutlineWallet } from "react-icons/ai";

export default function Sidebar({
  NavBarButton,
  isConnected,
  connectAccount,
  disConnectAccount,
  setTransparent,
  scrollTrigger,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
            My Wallet
          </DrawerHeader>
          <DrawerBody>
            {/* Connect */}
            <Flex mb="15px" fontSize="30px">
              <Flex flexDirection="row" flexWrap="wrap">
                <Image src={MetaMask} w="60%" />
                <Button
                  {...NavBarButton}
                  onClick={isConnected ? disConnectAccount : connectAccount}
                  w="20%"
                  ml="15%"
                >
                  {isConnected ? "Log Out" : "Connect"}
                </Button>
              </Flex>
            </Flex>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
