import { Web3NetworkSwitch } from "@web3modal/react"
import { Outlet } from "react-router-dom"

export default function HomeLayout() {
  return (
    <div className="p-4">
      <div className="flex justify-end">
        <Web3NetworkSwitch />
      </div>
      <Outlet />
    </div>
  )
}
