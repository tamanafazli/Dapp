const Test = artifacts.require("Test");
const Election = artifacts.require("Election");

module.exports = function(deployer) {
  deployer.deploy(Test)
    .then(() => deployer.deploy(Election));
};