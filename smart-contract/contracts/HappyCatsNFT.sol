// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract HappyCatsNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address marketplaceContract;
    event NFTMinted(uint256);

    constructor(address _marketplaceContract)
        ERC721("Happy Cats Fitness Club", "HCFC")
    {
        marketplaceContract = _marketplaceContract;
    }

    function mint(string memory _tokenURI) public {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        setApprovalForAll(marketplaceContract, true);
        emit NFTMinted(newTokenId);
    }
}
