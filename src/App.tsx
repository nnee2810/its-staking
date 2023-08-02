import { Web3Button, Web3Modal } from "@web3modal/react"
import { Toaster } from "react-hot-toast"
import { RouterProvider } from "react-router-dom"
import { useAccount } from "wagmi"
import { router } from "./configs/router"
import { ethereumClient } from "./helpers/web3"

export default function App() {
  const { isConnected } = useAccount()

  return (
    <>
      {isConnected ? (
        <RouterProvider router={router} />
      ) : (
        <div className="h-screen flex justify-center items-center">
          <Web3Button />
        </div>
      )}
      <Web3Modal
        projectId={import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID}
        ethereumClient={ethereumClient}
      />
      <Toaster position="top-left" />
    </>
  )
}
