var Faucet = artifacts.require("./Faucet.sol");

module.exports = function(deployer) {
  var token = "0x977bfb630b4d4d95ac7b288f1b54a07456cb6fb6";
  var dispatch = "0x48fc7291b5a760e76b1d82cf32b077a6975521d1";
  var oracle = "0x3fda6E7e9E5AEca8c6B3CD8c32079fB97a4cb221";
  deployer.deploy(Faucet, token, dispatch, oracle);
};