import { Button, useBoolean } from "@chakra-ui/react"
import {
  useNftContractApprovalForAllEvent,
  useNftContractIsApprovedForAll,
  useNftContractSetApprovalForAll,
} from "abi"
import { getWriteContractError } from "helpers/web3"
import { toast } from "react-hot-toast"
import { useStakingContractStore } from "store/stakingContract"
import { useAccount } from "wagmi"
import { waitForTransaction } from "wagmi/actions"

export default function ApproveForAllNft() {
  const account = useAccount()
  const { acceptedNft } = useStakingContractStore()
  const isApprovedForAll = useNftContractIsApprovedForAll({
    address: acceptedNft,
    args: [account.address!, import.meta.env.VITE_STAKING_CONTRACT_ADDRESS],
  })
  const approveForAllNft = useNftContractSetApprovalForAll({
    address: acceptedNft,
  })
  const [isLoading, setIsLoading] = useBoolean()

  const handleClick = async () => {
    if (isApprovedForAll.data === undefined) return
    try {
      setIsLoading.on()
      const { hash } = await approveForAllNft.writeAsync({
        args: [
          import.meta.env.VITE_STAKING_CONTRACT_ADDRESS,
          !isApprovedForAll.data,
        ],
      })
      await waitForTransaction({ hash })
      toast.success(
        `${isApprovedForAll.data ? "Revoked" : "Approved"} for all NFT`
      )
    } catch (error) {
      toast.error(getWriteContractError(error))
    } finally {
      setIsLoading.off()
    }
  }

  useNftContractApprovalForAllEvent({
    address: acceptedNft,
    listener() {
      isApprovedForAll.refetch()
    },
  })

  return (
    isApprovedForAll !== undefined && (
      <Button
        variant="outline"
        colorScheme={isApprovedForAll.data ? "red" : "teal"}
        isLoading={isLoading}
        onClick={handleClick}
      >
        {isApprovedForAll.data ? "Revoke" : "Approve"} for all NFT
      </Button>
    )
  )
}
