# NFT Marketplace Project

app route: https://nft-marketplace-9b2bd.firebaseapp.com/

## client

packages:

1. ethers for interacting with Ethereum blockchain (can use ethers or web3)
2. react-router-dom for multi page route
3. ipfs-http-client for store nft data
4. axios for putting request

## smart contract

packages:

1. @openzeppelin/contracts for standard contract
2. dotenv for load environment variable form .env
3. truffle-plugin-verify for verify smart contract's source code on Etherscan
4. @truffle/hdwallet-provider for sign transactions for addresses (used in truffle-config for deploy smart contract)

Folder structure is generated by `tree` command in terminal

# contract deployed to goerli testnet

HappyCats:
https://goerli.etherscan.io/address/0x5FBEaE1253392309e7C05ABE4DA8612EEc8a4d68

Marketplace:
https://goerli.etherscan.io/address/0x130e3b6f2948DF1d4e334e5C0Cd0a41BE3474Ced

# useful tutorials:

verify smart contract:
https://medium.com/quick-programming/verify-a-smart-contract-on-etherscan-using-truffle-cb2656fd9c41
