import { create } from "zustand"

interface StakingContractState {
  acceptedToken?: `0x${string}`
  acceptedNft?: `0x${string}`
  setAcceptedToken(address: `0x${string}`): void
  setAcceptedNft(address: `0x${string}`): void
}

export const useStakingContractStore = create<StakingContractState>((set) => ({
  setAcceptedToken: (acceptedToken) =>
    set({
      acceptedToken,
    }),
  setAcceptedNft: (acceptedNft) =>
    set({
      acceptedNft,
    }),
}))
