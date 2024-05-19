require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });
console.log(process.env.PRIVATE_KEY);

module.exports = {
  
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    bubs: {
      url: 'https://bubs-sepolia.rpc.caldera.xyz/http',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
