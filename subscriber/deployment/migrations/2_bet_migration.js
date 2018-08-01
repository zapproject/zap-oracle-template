var Weather = artifacts.require("./WeatherContract.sol");

module.exports = function(deployer) {
  deployer.deploy(Weather, "0x3fda6E7e9E5AEca8c6B3CD8c32079fB97a4cb221", );
};
