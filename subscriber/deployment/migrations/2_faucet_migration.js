var Faucet = artifacts.require("./Faucet.sol");

module.exports = function(deployer) {
  var token = "0xab605bf225f72e309491a8f0d94e56a07772a811";
  var owner = "0xE9aAE87E5f6189B8Df045Bb92038A9168c4aA60d";
  var dispatch = "0xac1763814975d1664aa580bf9eb234d5eea4e0ca";
  var oracle = "0x3fda6E7e9E5AEca8c6B3CD8c32079fB97a4cb221";
  deployer.deploy(Faucet, token, owner, dispatch, oracle);
};