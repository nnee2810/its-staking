import { defineConfig } from "@wagmi/cli"
import { react } from "@wagmi/cli/plugins"
import { Abi } from "viem"
import erc20ABI from "./src/abi/erc20ABI.json"
import erc721ABI from "./src/abi/erc721ABI.json"
import stakingABI from "./src/abi/stakingABI.json"

export default defineConfig({
  out: "./src/abi/index.ts",
  contracts: [
    {
      address: "0xebE5F4ED7ceD336A82aA107c27346CFCC5385fd7",
      abi: stakingABI as Abi,
      name: "StakingContract",
    },
    {
      abi: erc20ABI as Abi,
      name: "TokenContract",
    },
    {
      abi: erc721ABI as Abi,
      name: "NftContract",
    },
  ],
  plugins: [react()],
})
