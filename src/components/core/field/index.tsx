import { FormControl, FormLabel } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"
import TextInput, { TextInputProps } from "./TextInput"

type FieldProps = TextInputProps & {
  name: string
  label?: string
}

export default function Field(props: FieldProps) {
  const { variant, name, label } = props
  const { control } = useFormContext()

  return (
    <FormControl>
      <FormLabel mb={0} fontSize={12}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({
          field: {
            ref, //eslint-disable-line @typescript-eslint/no-unused-vars
            ...field
          },
          fieldState: { invalid, error },
        }) => (
          <>
            {variant === "text" && (
              <TextInput isInvalid={invalid} {...props} {...field} />
            )}
            {error?.message && (
              <div className="text-xs text-red-500">{error?.message}</div>
            )}
          </>
        )}
      />
    </FormControl>
  )
}
