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
import { formatEther, parseEther } from "viem"
import { useAccount } from "wagmi"
import { waitForTransaction } from "wagmi/actions"

interface FormValues {
  amount: string
}

export default function StakeToken() {
  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useBoolean()
  const { acceptedToken } = useStakingContractStore()
  const account = useAccount()
  const allowanceToken = useTokenContractAllowance({
    address: acceptedToken,
    args: [account.address!, import.meta.env.VITE_STAKING_CONTRACT_ADDRESS],
    enabled: false,
  })
  const stakeToken = useStakingContractStakeErc20()
  const form = useForm<FormValues>({
    defaultValues: {
      amount: "",
    },
    resolver: joiResolver(
      Joi.object<FormValues, true>({
        amount: bigIntSchema("Amount"),
      })
    ),
  })

  const handleSubmit = form.handleSubmit(async ({ amount }: FormValues) => {
    if (!acceptedToken || !allowanceToken.data) return
    if (parseEther(amount) > allowanceToken.data)
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
                {allowanceToken.isLoading ? (
                  <Skeleton h="2rem" />
                ) : (
                  allowanceToken.data !== undefined && (
                    <>
                      <div className="flex items-start gap-2">
                        <Field
                          variant="text"
                          name="amount"
                          label={`Amount (available: ${formatEther(
                            allowanceToken.data
                          )})`}
                        />
                        <div
                          className="mt-7 text-xs text-gray-600 font-bold cursor-pointer"
                          onClick={() =>
                            form.setValue(
                              "amount",
                              formatEther(allowanceToken.data || 0n)
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
                  isDisabled={!allowanceToken.data}
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
