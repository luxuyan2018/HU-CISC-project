var HappyCatsNFT = artifacts.require("HappyCatsNFT");
var Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer) {
  await deployer.deploy(Marketplace);
  const marketplace = await Marketplace.deployed();
  await deployer.deploy(HappyCatsNFT, marketplace.address);
};
