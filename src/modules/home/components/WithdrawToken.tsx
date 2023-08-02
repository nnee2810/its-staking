import { Button, useBoolean } from "@chakra-ui/react"
import { useStakingContractWithdrawErc20 } from "abi"
import { getWriteContractError } from "helpers/web3"
import Countdown from "react-countdown"
import { toast } from "react-hot-toast"
import { waitForTransaction } from "wagmi/actions"

interface WithdrawTokenProps {
  data: readonly [bigint, bigint]
}

export default function WithdrawToken({ data }: WithdrawTokenProps) {
  const withdrawToken = useStakingContractWithdrawErc20()
  const [isLoading, setIsLoading] = useBoolean()

  const handleWithdraw = async () => {
    try {
      setIsLoading.on()
      const { hash } = await withdrawToken.writeAsync()
      await waitForTransaction({ hash })
      toast.success("Withdraw token successfully")
    } catch (error) {
      toast.error(getWriteContractError(error))
    } finally {
      setIsLoading.off()
    }
  }

  return (
    <Countdown
      autoStart
      date={new Date(Number(data[1]) * 1000)}
      renderer={({ hours, minutes, seconds, completed }) =>
        completed ? (
          <Button
            colorScheme="teal"
            isLoading={isLoading}
            isDisabled={data ? !Number(data[0]) : true}
            onClick={handleWithdraw}
          >
            Withdraw
          </Button>
        ) : (
          <Button colorScheme="teal" isDisabled>
            Withdrawable in {!!hours && `${hours}h`}
            {!!minutes && `${minutes}m`}
            {seconds}s
          </Button>
        )
      }
    />
  )
}
