import Joi from "joi"
import { parseEther } from "viem"

export function bigIntSchema(name: string, size: number = 256) {
  return Joi.string()
    .label(name)
    .required()
    .custom((value: string, helpers) => {
      if (isNaN(Number(value)))
        return helpers.message({
          custom: "{{#label}} must be a number",
        })
      const convertedValue = parseEther(value)
      if (
        convertedValue <= 0n ||
        convertedValue > BigInt(2) ** BigInt(size) - BigInt(1)
      )
        return helpers.message({
          custom: "{{#label}} is out of range",
        })
      return value
    })
}
