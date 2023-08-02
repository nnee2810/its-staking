import { Skeleton, Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import {
  useStakingContractPendingErc20Withdrawals,
  useStakingContractUnstakedErc20Event,
  useStakingContractWithdrawalErc20Event,
} from "abi"
import { formatEther } from "viem"
import { useAccount } from "wagmi"
import WithdrawToken from "./WithdrawToken"

export default function PendingTokenWithdrawal() {
  const { address } = useAccount()
  const pendingTokenWithdrawal = useStakingContractPendingErc20Withdrawals({
    args: [address!],
  })

  useStakingContractUnstakedErc20Event({
    listener() {
      pendingTokenWithdrawal.refetch()
    },
  })
  useStakingContractWithdrawalErc20Event({
    listener() {
      pendingTokenWithdrawal.refetch()
    },
  })

  return (
    <Stat>
      <StatLabel>Pending token withdrawal</StatLabel>
      {pendingTokenWithdrawal.isLoading && <Skeleton height="2rem" />}
      {pendingTokenWithdrawal.data && (
        <>
          <StatNumber>{formatEther(pendingTokenWithdrawal.data[0])}</StatNumber>
          <div className="mt-2">
            <WithdrawToken data={pendingTokenWithdrawal.data} />
          </div>
        </>
      )}
    </Stat>
  )
}
