import Joi from "joi"
import { parseEther } from "utils/parseEther"

export function bigIntSchema(name: string, size: number = 256) {
  return Joi.number()
    .label(name)
    .required()
    .greater(0)
    .custom((value, helper) => {
      if (parseEther(value) > BigInt(2 ** size - 1))
        return helper.error("any.invalid")
      return value
    })
    .messages({
      "any.invalid": "{{#label}} is out of range",
    })
}
