import { ethers } from "ethers";
import { Marketplace, HappyCatsNFT } from "./ContractsAddress";

import { Image, Modal, ModalContent, ModalCloseButton } from "@chakra-ui/react";

export const getContracts = async () => {
  if (window.ethereum) {
    const networkId = await window.ethereum.request({
      method: "net_version",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    console.log(Marketplace, HappyCatsNFT, networkId);

    const marketplace = await new ethers.Contract(
      Marketplace.networks[networkId].address,
      Marketplace.abi,
      signer
    );

    const boredPets = await new ethers.Contract(
      HappyCatsNFT.networks[networkId].address,
      HappyCatsNFT.abi,
      signer
    );
    return { marketplace, boredPets };
  }
};

export const REJECT_TXN_TEXT =
  "You rejected the transaction in your cryptocurrency wallet.";

export const ImageModal = (isOpen, onClose, image) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      {/* adjust modal size */}
      <ModalContent maxW="50rem">
        <ModalCloseButton
          size="md"
          fontSize="30px"
          borderRadius="10px"
          position="absolute"
          backgroundColor="#D53F8C"
          fontFamily="VT323"
        >
          &#10007;
        </ModalCloseButton>
        <Image src={image} />
      </ModalContent>
    </Modal>
  );
};
