require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: '.env.local' });

const rpcUrl =
  process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL ||
  'https://ethereum-sepolia-rpc.publicnode.com';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.20',
  networks: {
    sepolia: {
      url: rpcUrl,
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
    },
  },
};
