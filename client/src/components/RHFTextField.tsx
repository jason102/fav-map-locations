import {
  Controller,
  FieldValues,
  RegisterOptions,
  UseControllerProps,
} from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";

// The types for the React Hook Form (RHF) are complicated, so I got this <T> generics solution from:
// https://dev.to/meijin/component-design-idea-using-react-hook-form-v7-ie0
type RHFTextFieldProps<T extends FieldValues> = TextFieldProps &
  UseControllerProps<T> &
  RegisterOptions;

// Can accept a combination of MUI TextFieldProps, the React Hook Form (RHF) Controller control prop,
// and the RHF register() validation props
const RHFTextField = <T extends FieldValues>({
  name,
  control,
  validate, // Extracted so it's not passed to TextField, which can't accept it as a prop
  ...restProps
}: RHFTextFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    rules={{ validate, ...restProps }} // Can pass in pattern, required, maxLength etc. via restProps (note that prop "required" is shared between both rules and the MUI TextField)
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <TextField
        name={name}
        error={!!error}
        value={value}
        onChange={onChange}
        helperText={error ? error.message : undefined}
        {...restProps}
      />
    )}
  />
);

export default RHFTextField;
