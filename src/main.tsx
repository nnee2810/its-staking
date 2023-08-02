import { ChakraProvider } from "@chakra-ui/react"
import ReactDOM from "react-dom/client"
import "styles/global.css"
import { theme } from "styles/theme.ts"
import { WagmiConfig } from "wagmi"
import App from "./App.tsx"
import { wagmiConfig } from "./helpers/web3.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WagmiConfig config={wagmiConfig}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </WagmiConfig>
)
