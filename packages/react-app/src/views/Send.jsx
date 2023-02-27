import { Button } from "antd";
import React from "react";
import { Wallet, Contract, utils, Provider } from "zksync-web3";
import externalContracts from "../contracts/external_contracts";

function Send() {
  const RICH_WALLET_PK = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

  const BUIDLBUXX_PAYMASTER_ADDRESS = "0x628e8b27F0c5c443a68297893c920328dD18e611";

  // TODO: use chainId from provider
  const abi = externalContracts[270].contracts.BuidlBuxx.abi;
  const BUIDLBUXX_ADDRESS = externalContracts[270].contracts.BuidlBuxx.address;

  return (
    <Button
      onClick={async () => {
        const providerZk = new Provider("http://localhost:3050");
        const wallet = new Wallet(RICH_WALLET_PK, providerZk);

        const wallet3 = new Wallet("0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e");

        const currentBalance = await wallet.getBalance();
        console.log("currentBalance: ", currentBalance);

        const paymasterParams = utils.getPaymasterParams(BUIDLBUXX_PAYMASTER_ADDRESS, {
          type: "General",
          innerInput: new Uint8Array(),
        });

        const contractBuildBuxx = new Contract(BUIDLBUXX_ADDRESS, abi, wallet);

        console.log("contractBuildBuxx: ", contractBuildBuxx);

        const gasLimit = 300000;

        await (
          await contractBuildBuxx.transfer(wallet3.address, 100, {
            gasLimit,
            customData: {
              paymasterParams,
              ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
            },
          })
        ).wait();
      }}
    >
      Send with Paymaster
    </Button>
  );
}

export default Send;
