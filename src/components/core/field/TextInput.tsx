import { Input, InputProps } from "@chakra-ui/react"

export interface TextInputProps extends InputProps {
  variant: "text"
}

export default function TextInput({
  variant, //eslint-disable-line @typescript-eslint/no-unused-vars
  ...props
}: TextInputProps) {
  return <Input size="md" {...props} />
}
