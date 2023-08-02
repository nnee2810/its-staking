import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useBoolean,
} from "@chakra-ui/react"
import { joiResolver } from "@hookform/resolvers/joi"
import { useStakingContractStakeErc721 } from "abi"
import Field from "components/core/field"
import { bigIntSchema } from "helpers/validationSchema"
import { getWriteContractError } from "helpers/web3"
import Joi from "joi"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useStakingContractStore } from "store/stakingContract"
import { waitForTransaction } from "wagmi/actions"

interface FormValues {
  id: string
}

export default function StakeNft() {
  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useBoolean()
  const form = useForm<FormValues>({
    defaultValues: {
      id: "",
    },
    resolver: joiResolver(
      Joi.object<FormValues, true>({
        id: bigIntSchema("ID"),
      })
    ),
  })
  const { acceptedNft } = useStakingContractStore()
  const stakeNft = useStakingContractStakeErc721()

  const handleSubmit = form.handleSubmit(async ({ id }: FormValues) => {
    if (!acceptedNft) return
    try {
      setIsLoading.on()
      const { hash } = await stakeNft.writeAsync({
        args: [BigInt(id)],
      })
      await waitForTransaction({
        hash,
      })

      toast.success("Stake NFT successfully")
      setIsOpen.off()
    } catch (error) {
      toast.error(getWriteContractError(error))
    } finally {
      setIsLoading.off()
    }
  })

  useEffect(() => {
    if (!isOpen) form.reset()
  }, [isOpen, form])

  return (
    <div>
      <Button colorScheme="teal" onClick={setIsOpen.on}>
        Stake
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={setIsOpen.off}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <FormProvider {...form}>
          <form onSubmit={handleSubmit}>
            <ModalContent>
              <ModalHeader>Stake NFT</ModalHeader>
              <ModalBody>
                <Field variant="text" name="id" label="ID" />
              </ModalBody>
              <ModalFooter className="gap-1">
                <Button isDisabled={isLoading} onClick={setIsOpen.off}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme="teal" isLoading={isLoading}>
                  Submit
                </Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </FormProvider>
      </Modal>
    </div>
  )
}
