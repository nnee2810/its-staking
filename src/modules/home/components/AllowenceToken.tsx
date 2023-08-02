import { Skeleton, Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import {
  useStakingContractStakedErc20Event,
  useTokenContractAllowance,
  useTokenContractApprovalEvent,
} from "abi"
import { useStakingContractStore } from "store/stakingContract"
import { formatEther } from "viem"
import { useAccount } from "wagmi"
import ApproveToken from "./ApproveToken"

export default function AllowenceToken() {
  const { acceptedToken } = useStakingContractStore()
  const account = useAccount()
  const allowenceToken = useTokenContractAllowance({
    address: acceptedToken,
    args: [account.address!, import.meta.env.VITE_STAKING_CONTRACT_ADDRESS],
  })

  useStakingContractStakedErc20Event({
    listener() {
      allowenceToken.refetch()
    },
  })
  useTokenContractApprovalEvent({
    address: acceptedToken,
    listener() {
      allowenceToken.refetch()
    },
  })

  return (
    <Stat>
      <StatLabel>Allowence token</StatLabel>
      {allowenceToken.isLoading && <Skeleton height="2rem" />}
      {allowenceToken.data !== undefined && (
        <>
          <StatNumber>{String(formatEther(allowenceToken.data))}</StatNumber>
          <div className="mt-2 flex gap-1">
            <ApproveToken />
          </div>
        </>
      )}
    </Stat>
  )
}
