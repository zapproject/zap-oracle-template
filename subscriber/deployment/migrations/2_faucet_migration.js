var Faucet = artifacts.require("./Faucet.sol");

module.exports = function(deployer) {
  var token = "0x977bfb630b4d4d95ac7b288f1b54a07456cb6fb6";
  var dispatch = "0x095ccba64b410c47c9fe8fc491c6cc887b3ba597";
  var oracle = "0x3fda6E7e9E5AEca8c6B3CD8c32079fB97a4cb221";
  deployer.deploy(Faucet, token, dispatch, oracle);
};