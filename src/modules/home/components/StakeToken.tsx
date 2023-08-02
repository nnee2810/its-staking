import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  useBoolean,
} from "@chakra-ui/react"
import { joiResolver } from "@hookform/resolvers/joi"
import { useStakingContractStakeErc20, useTokenContractAllowance } from "abi"
import Field from "components/core/field"
import { bigIntSchema } from "helpers/validationSchema"
import { getWriteContractError } from "helpers/web3"
import Joi from "joi"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useStakingContractStore } from "store/stakingContract"
import { parseEther } from "utils/parseEther"
import { formatEther } from "viem"
import { useAccount } from "wagmi"
import { waitForTransaction } from "wagmi/actions"

interface FormValues {
  amount: number
}

export default function StakeToken() {
  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useBoolean()
  const { acceptedToken } = useStakingContractStore()
  const account = useAccount()
  const allowenceToken = useTokenContractAllowance({
    address: acceptedToken,
    args: [account.address!, import.meta.env.VITE_STAKING_CONTRACT_ADDRESS],
    enabled: false,
  })
  const stakeToken = useStakingContractStakeErc20()
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

  const handleSubmit = form.handleSubmit(async ({ amount }: FormValues) => {
    if (!acceptedToken || !allowenceToken.data) return
    if (parseEther(amount) > allowenceToken.data)
      return toast.error("Amount exceeds token staking")
    try {
      setIsLoading.on()
      const { hash } = await stakeToken.writeAsync({
        args: [parseEther(amount)],
      })
      await waitForTransaction({
        hash,
      })

      toast.success("Stake token successfully")
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
              <ModalHeader>Stake token</ModalHeader>
              <ModalBody className="space-y-2">
                {allowenceToken.isLoading ? (
                  <Skeleton h="2rem" />
                ) : (
                  allowenceToken.data !== undefined && (
                    <>
                      <div className="flex items-start gap-2">
                        <Field
                          variant="text"
                          type="number"
                          name="amount"
                          label={`Amount (available: ${formatEther(
                            allowenceToken.data
                          )})`}
                        />
                        <div
                          className="mt-7 text-xs text-gray-600 font-bold cursor-pointer"
                          onClick={() =>
                            form.setValue(
                              "amount",
                              Number(formatEther(allowenceToken.data || 0n))
                            )
                          }
                        >
                          MAX
                        </div>
                      </div>
                    </>
                  )
                )}
              </ModalBody>
              <ModalFooter className="gap-1">
                <Button isDisabled={isLoading} onClick={setIsOpen.off}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="teal"
                  isDisabled={!allowenceToken.data}
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
