import { Skeleton, Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import {
  useStakingContractAcceptedNft,
  useStakingContractAcceptedToken,
  useStakingContractCooldownPeriod,
  useStakingContractMaxNftStaking,
} from "abi"
import { useEffect } from "react"
import { useStakingContractStore } from "store/stakingContract"
import { getEtherScanAddressUrl } from "utils/etherScanUrl"

export default function Header() {
  const { setAcceptedToken, setAcceptedNft } = useStakingContractStore()
  const acceptedToken = useStakingContractAcceptedToken()
  const acceptedNft = useStakingContractAcceptedNft()
  const { data: cooldownPeriodData, isLoading: cooldownPeriodLoading } =
    useStakingContractCooldownPeriod()
  const maxNftStaking = useStakingContractMaxNftStaking()

  useEffect(() => {
    if (acceptedToken.data) setAcceptedToken(acceptedToken.data)
  }, [acceptedToken.data, setAcceptedToken])
  useEffect(() => {
    if (acceptedNft.data) setAcceptedNft(acceptedNft.data)
  }, [acceptedNft.data, setAcceptedNft])

  return (
    <div className="p-4 grid grid-cols-2 gap-4 border rounded-md">
      <Stat>
        <StatLabel>Accepted token</StatLabel>
        {acceptedToken.isLoading && <Skeleton height="2rem" />}
        {acceptedToken.data && (
          <StatNumber>
            <a
              href={getEtherScanAddressUrl(acceptedToken.data)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {acceptedToken.data}
            </a>
          </StatNumber>
        )}
      </Stat>
      <Stat>
        <StatLabel>Accepted NFT</StatLabel>
        {acceptedNft.isLoading && <Skeleton height="2rem" />}
        {acceptedNft.data && (
          <StatNumber>
            <a
              href={getEtherScanAddressUrl(acceptedNft.data)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {acceptedNft.data}
            </a>
          </StatNumber>
        )}
      </Stat>
      <Stat>
        <StatLabel>Cooldown period</StatLabel>
        {cooldownPeriodLoading && <Skeleton height="2rem" />}
        {cooldownPeriodData !== undefined && (
          <StatNumber>{String(cooldownPeriodData)}s</StatNumber>
        )}
      </Stat>
      <Stat>
        <StatLabel>Max NFT stakings</StatLabel>
        {maxNftStaking.isLoading && <Skeleton height="2rem" />}
        {maxNftStaking.data !== undefined && (
          <StatNumber>{String(maxNftStaking.data)}</StatNumber>
        )}
      </Stat>
    </div>
  )
}
