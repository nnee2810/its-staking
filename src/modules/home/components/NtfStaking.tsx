import { Button, Skeleton, Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import {
  useStakingContractGetnftStakings,
  useStakingContractMaxNftStaking,
  useStakingContractStakedErc721Event,
  useStakingContractUnstakedErc721Event,
} from "abi"
import { useAccount } from "wagmi"
import ApproveForAllNft from "./ApproveForAllNft"
import StakeNft from "./StakeNft"
import UnstakeNft from "./UnstakeNft"

export default function NtfStaking() {
  const { address } = useAccount()
  const nftStaking = useStakingContractGetnftStakings({
    args: [address!],
  })
  const maxNftStaking = useStakingContractMaxNftStaking()

  useStakingContractStakedErc721Event({
    listener() {
      nftStaking.refetch()
    },
  })
  useStakingContractUnstakedErc721Event({
    listener() {
      nftStaking.refetch()
    },
  })

  return (
    <Stat>
      <StatLabel>NFT Staking</StatLabel>
      {nftStaking.isLoading && <Skeleton height="2rem" />}
      {nftStaking.data && (
        <>
          <div className="flex items-center gap-2">
            <StatNumber>{nftStaking.data.length}</StatNumber>
          </div>
          <div className="mt-2 flex gap-1">
            {!!maxNftStaking.data &&
              (nftStaking.data.length < maxNftStaking.data ? (
                <StakeNft />
              ) : (
                <Button colorScheme="teal" isDisabled>
                  Reach max NFT staking
                </Button>
              ))}
            <UnstakeNft data={nftStaking.data} />
            <ApproveForAllNft />
          </div>
        </>
      )}
    </Stat>
  )
}
