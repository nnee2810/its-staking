import { sepolia } from "@wagmi/core/chains"
import { EthereumClient, w3mConnectors } from "@web3modal/ethereum"
import { ContractFunctionExecutionError, TransactionExecutionError } from "viem"
import { configureChains, createConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"

const { chains, publicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || "",
    }),
  ]
)
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    chains,
  }),
  publicClient,
})
export const ethereumClient = new EthereumClient(wagmiConfig, chains)
export function getWriteContractError(error: unknown) {
  if (
    error instanceof ContractFunctionExecutionError ||
    error instanceof TransactionExecutionError
  )
    return error.shortMessage
  return "Excution error"
}
