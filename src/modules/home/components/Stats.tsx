import AllowanceToken from "./AllowanceToken"
import NtfStaking from "./NtfStaking"
import PendingNftWithdrawal from "./PendingNftWithdrawal"
import PendingTokenWithdrawal from "./PendingTokenWithdrawal"
import TokenStaking from "./TokenStaking"

export default function Stats() {
  return (
    <div className="grid grid-cols-2 items-start gap-2">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 p-4 border rounded-md">
        <TokenStaking />
        <PendingTokenWithdrawal />
        <AllowanceToken />
      </div>
      <div className="grid grid-cols-2 p-4 border rounded-md">
        <NtfStaking />
        <PendingNftWithdrawal />
      </div>
    </div>
  )
}
