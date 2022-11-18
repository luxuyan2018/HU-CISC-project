const dotenv = require("dotenv");
const HDWalletProvider = require("@truffle/hdwallet-provider");

dotenv.config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    goerli: {
      provider: () =>
        new HDWalletProvider(
          process.env.APP_PRIVATE_KEY,
          process.env.APP_GOERLI_RPC_URL
        ),
      network_id: 5,
      from: "0x1e4BA1401de4D74f7D4F6e383E848baa881B5277",
    },
  },
  etherscan: {
    apiKey: process.env.APP_ETHERSCAN_API_KEY,
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.14",
    },
  },
};
