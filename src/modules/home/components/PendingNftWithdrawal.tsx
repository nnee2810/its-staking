import { Skeleton, Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import {
  useStakingContractGetPendingErc721Withdrawals,
  useStakingContractUnstakedErc721Event,
  useStakingContractWithdrawalErc721Event,
} from "abi"
import { useAccount } from "wagmi"
import WithdrawNft from "./WithdrawNft"

export default function PendingNftWithdrawal() {
  const { address } = useAccount()
  const pendingNftWithdrawal = useStakingContractGetPendingErc721Withdrawals({
    args: [address!],
  })

  useStakingContractUnstakedErc721Event({
    listener() {
      pendingNftWithdrawal.refetch()
    },
  })
  useStakingContractWithdrawalErc721Event({
    listener() {
      pendingNftWithdrawal.refetch()
    },
  })

  return (
    <Stat>
      <StatLabel>Pending NFT withdrawal</StatLabel>
      {pendingNftWithdrawal.isLoading && <Skeleton height="2rem" />}
      {pendingNftWithdrawal.data && (
        <>
          <StatNumber>{pendingNftWithdrawal.data.length}</StatNumber>
          <div className="mt-2">
            <WithdrawNft data={pendingNftWithdrawal.data} />
          </div>
        </>
      )}
    </Stat>
  )
}
