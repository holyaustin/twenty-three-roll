import { ethers } from "ethers"
const networks = {
  BubsTestnet: {
    chainId: '2125031',   // 2125031   0x206CE7  0x206ce7
    chainName: 'Bubs testnet',
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://bubs-sepolia.rpc.caldera.xyz/http'],
    blockExplorerUrls: ['https://bubs-sepolia.explorer.caldera.xyz/']
  },
};

const switchNetwork = async (networkName, chainId) => {
  var hex_chainId = ethers.utils.hexValue(2125031) ;
  console.log('hex_chainId :' + hex_chainId); 
  
  if (!window.ethereum) return;
  const { ethereum } = window;

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hex_chainId }],
    });
  } catch (error) {
    if (error.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks[networkName],
            },
          ],
        });
      } catch (error) {
        alert(error.message);
      }
    }
  }
};

export default switchNetwork;
