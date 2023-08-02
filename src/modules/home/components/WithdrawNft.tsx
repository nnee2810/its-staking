import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useBoolean,
  useCheckboxGroup,
} from "@chakra-ui/react"
import { useStakingContractWithdrawMultipleErc721 } from "abi"
import { getWriteContractError } from "helpers/web3"
import { useEffect } from "react"
import Countdown from "react-countdown"
import { toast } from "react-hot-toast"
import { waitForTransaction } from "wagmi/actions"

interface WithdrawNftProps {
  data: readonly {
    tokenId: bigint
    applicableAt: bigint
  }[]
}

export default function WithdrawNft({ data }: WithdrawNftProps) {
  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useBoolean()
  const unstakeMultipleNft = useStakingContractWithdrawMultipleErc721()
  const checkBoxGroup = useCheckboxGroup()

  const handleSubmit = async () => {
    try {
      setIsLoading.on()
      const { hash } = await unstakeMultipleNft.writeAsync({
        args: [checkBoxGroup.value.map(BigInt)],
      })
      await waitForTransaction({ hash })
      toast.success("Withdraw NFT successfully")
    } catch (error) {
      toast.error(getWriteContractError(error))
    } finally {
      setIsLoading.off()
    }
  }

  useEffect(() => {
    if (!isOpen) checkBoxGroup.setValue([])
  }, [isOpen, checkBoxGroup])
  useEffect(() => {
    if (!data.length) setIsOpen.off()
  }, [data, setIsOpen])

  return (
    <div>
      <Button
        colorScheme="teal"
        isDisabled={!data.length}
        onClick={setIsOpen.on}
      >
        Withdraw
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={setIsOpen.off}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw NFT</ModalHeader>
          <ModalBody className="space-y-2">
            <CheckboxGroup value={checkBoxGroup.value}>
              {data.map((item) => (
                <div
                  className="px-4 py-2 flex justify-between gap-2 bg-gray-50 rounded-lg"
                  key={String(item.tokenId)}
                >
                  <Countdown
                    autoStart
                    date={new Date(Number(item.applicableAt) * 1000)}
                    renderer={({ hours, minutes, seconds, completed }) =>
                      completed ? (
                        <Checkbox
                          value={String(item.tokenId)}
                          onChange={checkBoxGroup.onChange}
                        >
                          {String(item.tokenId)}
                        </Checkbox>
                      ) : (
                        <>
                          <Checkbox isDisabled>{String(item.tokenId)}</Checkbox>
                          <div className="text-sm">
                            available in {!!hours && `${hours}h`}
                            {!!minutes && `${minutes}m`}
                            {seconds}s
                          </div>
                        </>
                      )
                    }
                    key={Number(item.applicableAt)}
                  />
                </div>
              ))}
            </CheckboxGroup>
          </ModalBody>
          <ModalFooter className="gap-1">
            <Button isDisabled={isLoading} onClick={setIsOpen.off}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              isDisabled={!checkBoxGroup.value.length}
              isLoading={isLoading}
              onClick={handleSubmit}
            >
              Submit{" "}
              {!!checkBoxGroup.value.length &&
                `(${checkBoxGroup.value.length})`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
