const BigToken = artifacts.require("./BigToken.sol");
const BigTokenSale = artifacts.require("./BigTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(BigToken, 1000000).then(async function() {
    // Token price is 0.001 ether
    var tokenPrice = 1000000000000000;
    await deployer.deploy(BigTokenSale, BigToken.address, tokenPrice);
  })
};



// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");

// module.exports = function(deployer) {
//   deployer.deploy(ConvertLib);
//   deployer.link(ConvertLib, MetaCoin);
//   deployer.deploy(MetaCoin);
// };
