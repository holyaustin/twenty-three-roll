import React, { useState, useContext, useEffect } from "react";
import TransactionProvider from "../../context/TransactionContext";
import { useNetwork } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import {
  // priceConsumerV3Abi,
  // priceConsumerV3Address,
  luckySevenGameAbi,
  luckyGameAddress,
  providerUrl
} from "../../utils/constants";

const Trade = () => {
  const { trading, setTrading, updateGameToken, gameToken } =
    useContext(TransactionProvider);
  const network = useNetwork();
  const [TTTTokenPrice, setTTTTokenPrice] = useState(0);
  const [nativeToken, setNativeToken] = useState(0);
  const [TTTToken, setTTTToken] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const address = useAddress();
 
  useEffect(() => {
    (async () => {
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);
      let balance = await provider.getBalance(address);
      balance = Math.round(ethers.utils.formatEther(balance) * 1e4) / 1e4;
      setTokenBalance(balance);
      updateXrcToken(0);
    })();
  }, [address]);

  useEffect(() => {
    (async () => {
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);
/**
      const priceConsumerV3 = new ethers.Contract(
        priceConsumerV3Address,
        priceConsumerV3Abi,
        provider
      );
 */
      let roundData = 10000000;
      // roundData = Math.round((roundData / 1000000) * 1e2) / 1e2;
      console.log("roundData", roundData);
      setTTTTokenPrice(roundData);
      console.log("nativeToken", nativeToken);
      setTTTToken((Math.round(roundData * nativeToken) * 1e4) / 1e4);
    })();
  }, [tokenBalance]);

  const updateLGTToken = (val) => {
    setTTTToken(val);
    setNativeToken(Math.round((val / TTTTokenPrice) * 10000) / 10000);
  };

  const updateXrcToken = (val) => {
    setNativeToken(val);
    setTTTToken(Math.round(TTTTokenPrice * val * 10000) / 10000);
  };

  const buyToken = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const luckyGame = new ethers.Contract(
      luckyGameAddress,
      luckySevenGameAbi,
      provider.getSigner()
    );
    console.log("TToken to buy -", ethers.utils.parseEther(TTTToken.toString()))
    console.log("nativeToken to buy -", ethers.utils.parseEther(nativeToken.toString()))
    await luckyGame.buyToken(ethers.utils.parseEther(TTTToken.toString()), {
      from: address,
      value: ethers.utils.parseEther(nativeToken.toString()),
      //gasLimit: 3000000
    });

    alert("You have successfully purchased your TTT game token ");
    console.log("You have successfully purchased your TTT game token ");
  };

  return (
    <div className="content-center justify-center">
      <div className="flex justify-between pb-3">
        <span className="text-xl">Swap</span>
        <span className="cursor-pointer" onClick={() => setTrading(false)}>
          X
        </span>
      </div>
      <div className="rounded flex justify-between bg-slate-50 p-3 border-2">
        <input
          type="text"
          className="border-1 text-xl"
          value={nativeToken}
          onChange={(e) => updateXrcToken(e.target.value)}
        />
        <div className="bg-slate-200 w-40 p-1 shadow-md rounded">
          <select className="bg-slate-200 w-full">
            <option value="XDC" defaultValue={true}>
              ETH
            </option>
          </select>
        </div>
      </div>
      <div className="rounded flex justify-between bg-slate-50 p-3 ">
        <div></div>
        <div
          className="cursor-pointer"
          onClick={() => updateXrcToken(tokenBalance)}
        >
          Balance: {tokenBalance}
          {tokenBalance != nativeToken && (
            <span className="ml-2 text-xs px-2 bg-red-300 rounded-lg">Max</span>
          )}
        </div>
      </div>

      <div className="rounded flex justify-center bg-slate-50 "></div>

      <div className="rounded flex justify-between bg-slate-50 p-3 mt-2 border-2">
        <input
          type="text"
          className="border-0 text-xl"
          value={TTTToken}
          onChange={(e) => updateLGTToken(e.target.value)}
        />
        <div className="bg-slate-200 w-40 p-1 shadow-md rounded">TTT Token</div>
      </div>
      <div className="rounded flex justify-between bg-slate-50 p-3">
        <div></div>
        <div>Balance: {gameToken}</div>
      </div>

      <div className="rounded flex justify-start  p-3 mt-2">
        <span>1 ETH = {TTTTokenPrice} TTT</span>
      </div>

      {tokenBalance >= nativeToken ? (
        <div
          className="rounded-2xl flex justify-center bg-red-500 hover:bg-red-400 p-3 mt-2 text-2xl text-white cursor-pointer"
          onClick={buyToken}
        >
          Swap
        </div>
      ) : (
        <div className="rounded-2xl flex justify-center bg-gray-300 p-3 mt-2">
          Insufficient liquidity for this trade
        </div>
      )}
    </div>
  );
};

export default Trade;
