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
import { useTokenContractApprove } from "abi"
import Field from "components/core/field"
import { bigIntSchema } from "helpers/validationSchema"
import { getWriteContractError } from "helpers/web3"
import Joi from "joi"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useStakingContractStore } from "store/stakingContract"
import { parseEther } from "utils/parseEther"
import { waitForTransaction } from "wagmi/actions"

interface FormValues {
  amount: number
}

export default function ApproveToken() {
  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useBoolean()
  const form = useForm<FormValues>({
    defaultValues: {
      amount: 0,
    },
    resolver: joiResolver(
      Joi.object<FormValues, true>({
        amount: bigIntSchema("Amount"),
      })
    ),
  })
  const { acceptedToken } = useStakingContractStore()
  const approveToken = useTokenContractApprove({
    address: acceptedToken,
  })

  const handleSubmit = form.handleSubmit(async (values: FormValues) => {
    if (!acceptedToken) return
    try {
      setIsLoading.on()

      const { hash } = await approveToken.writeAsync({
        args: [
          import.meta.env.VITE_STAKING_CONTRACT_ADDRESS,
          parseEther(values.amount),
        ],
      })
      await waitForTransaction({
        hash,
      })

      toast.success("Approve token successfully")
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
        Approve
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
              <ModalHeader>Approve token</ModalHeader>
              <ModalBody>
                <Field
                  variant="text"
                  type="number"
                  name="amount"
                  label="Amount"
                />
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
