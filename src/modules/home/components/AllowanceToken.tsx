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

export default function AllowanceToken() {
  const { acceptedToken } = useStakingContractStore()
  const account = useAccount()
  const allowanceToken = useTokenContractAllowance({
    address: acceptedToken,
    args: [account.address!, import.meta.env.VITE_STAKING_CONTRACT_ADDRESS],
  })

  useStakingContractStakedErc20Event({
    listener() {
      allowanceToken.refetch()
    },
  })
  useTokenContractApprovalEvent({
    address: acceptedToken,
    listener() {
      allowanceToken.refetch()
    },
  })

  return (
    <Stat>
      <StatLabel>Allowance token</StatLabel>
      {allowanceToken.isLoading && <Skeleton height="2rem" />}
      {allowanceToken.data !== undefined && (
        <>
          <StatNumber>{String(formatEther(allowanceToken.data))}</StatNumber>
          <div className="mt-2 flex gap-1">
            <ApproveToken />
          </div>
        </>
      )}
    </Stat>
  )
}
