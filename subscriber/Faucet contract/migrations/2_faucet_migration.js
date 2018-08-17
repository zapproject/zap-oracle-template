var Faucet = artifacts.require("./Faucet.sol");

module.exports = function(deployer) {
  var coord = "0x0014f9acd4f4ad4ac65fec3dcee75736fd0a0230";
  var oracle = "0x3fda6E7e9E5AEca8c6B3CD8c32079fB97a4cb221";
  deployer.deploy(Faucet, coord, oracle);
};