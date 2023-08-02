export function parseEther(value: number) {
  return BigInt(value * 10 ** 18)
}
