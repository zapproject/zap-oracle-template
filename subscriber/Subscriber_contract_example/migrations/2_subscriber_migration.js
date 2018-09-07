var Subscriber = artifacts.require("./SimpleSubscriber.sol");
const zapCoordinatorAddress = "0x0014f9acd4f4ad4ac65fec3dcee75736fd0a0230";
module.exports = function(deployer) {
  deployer.deploy(Subscriber,zapCoordinatorAddress);
};
