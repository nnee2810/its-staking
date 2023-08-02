import { Skeleton, Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import {
  useStakingContractStakedErc20Event,
  useStakingContractStaking,
  useStakingContractUnstakedErc20Event,
} from "abi"
import { formatEther } from "viem"
import { useAccount } from "wagmi"
import StakeToken from "./StakeToken"
import UnstakeToken from "./UnstakeToken"

export default function TokenStaking() {
  const { address } = useAccount()
  const tokenStaking = useStakingContractStaking({
    args: [address!],
  })

  useStakingContractStakedErc20Event({
    listener() {
      tokenStaking.refetch()
    },
  })
  useStakingContractUnstakedErc20Event({
    listener() {
      tokenStaking.refetch()
    },
  })

  return (
    <Stat>
      <StatLabel>Token staking</StatLabel>
      {tokenStaking.isLoading && <Skeleton height="2rem" />}
      {tokenStaking.data !== undefined && (
        <>
          <StatNumber>{String(formatEther(tokenStaking.data))}</StatNumber>
          <div className="mt-2 flex gap-1">
            <StakeToken />
            <UnstakeToken data={tokenStaking.data} />
          </div>
        </>
      )}
    </Stat>
  )
}
