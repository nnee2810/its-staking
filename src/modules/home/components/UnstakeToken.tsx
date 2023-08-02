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
import { useStakingContractUnstakeErc20 } from "abi"
import Field from "components/core/field"
import { bigIntSchema } from "helpers/validationSchema"
import { getWriteContractError } from "helpers/web3"
import Joi from "joi"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { parseEther } from "utils/parseEther"
import { formatEther } from "viem"
import { waitForTransaction } from "wagmi/actions"

interface UnstakeTokenProps {
  data: bigint
}
interface FormValues {
  amount: number
}

export default function UnstakeToken({ data }: UnstakeTokenProps) {
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
  const unstakeToken = useStakingContractUnstakeErc20()

  const handleSubmit = form.handleSubmit(async ({ amount }: FormValues) => {
    if (parseEther(amount) > data)
      return toast.error("Amount exceeds token staking")
    try {
      setIsLoading.on()
      const transaction = await unstakeToken.writeAsync({
        args: [parseEther(amount)],
      })
      await waitForTransaction({
        hash: transaction.hash,
      })

      toast.success("Unstake token successfully")
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
      <Button
        variant="outline"
        colorScheme="red"
        isDisabled={!data}
        onClick={setIsOpen.on}
      >
        Unstake
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
              <ModalHeader>Unstake token</ModalHeader>
              <ModalBody>
                <div className="flex items-start gap-2">
                  <Field
                    variant="text"
                    type="number"
                    name="amount"
                    label={`Amount (available: ${formatEther(data)})`}
                  />
                  <div
                    className="mt-7 text-xs text-gray-600 font-bold cursor-pointer"
                    onClick={() =>
                      form.setValue("amount", Number(formatEther(data || 0n)))
                    }
                  >
                    MAX
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="gap-1">
                <Button isDisabled={isLoading} onClick={setIsOpen.off}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="teal"
                  isDisabled={!data}
                  isLoading={isLoading}
                >
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
