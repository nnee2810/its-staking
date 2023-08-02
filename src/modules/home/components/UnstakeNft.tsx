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
import { useStakingContractUnstakeMultipleErc721 } from "abi"
import { getWriteContractError } from "helpers/web3"
import { useEffect } from "react"
import { toast } from "react-hot-toast"
import { waitForTransaction } from "wagmi/actions"

interface UnstakeNftProps {
  data: readonly bigint[]
}

export default function UnstakeNft({ data }: UnstakeNftProps) {
  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useBoolean()
  const unstakeMultipleNft = useStakingContractUnstakeMultipleErc721()
  const checkBoxGroup = useCheckboxGroup()

  const handleSubmit = async () => {
    try {
      setIsLoading.on()
      const { hash } = await unstakeMultipleNft.writeAsync({
        args: [checkBoxGroup.value.map(BigInt)],
      })
      await waitForTransaction({ hash })
      toast.success("Unstake NFT successfully")
    } catch (error) {
      toast.error(getWriteContractError(error))
    } finally {
      setIsLoading.off()
    }
  }

  useEffect(() => {
    if (!data.length) setIsOpen.off()
  }, [data, setIsOpen])

  return (
    <div>
      <Button
        variant="outline"
        colorScheme="red"
        isDisabled={!data.length}
        onClick={setIsOpen.on}
      >
        Unstake
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={setIsOpen.off}
        onCloseComplete={checkBoxGroup.setValue.bind(null, [])}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unstake NFT</ModalHeader>
          <ModalBody className="space-y-2">
            <CheckboxGroup value={checkBoxGroup.value}>
              {data.map((id) => (
                <div
                  className="px-4 py-2 flex gap-2 bg-gray-50 rounded-lg"
                  key={String(id)}
                >
                  <Checkbox
                    value={String(id)}
                    onChange={checkBoxGroup.onChange}
                  >
                    {String(id)}
                  </Checkbox>
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
