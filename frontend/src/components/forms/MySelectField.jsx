import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller } from "react-hook-form";

export default function MySelectField(props) {
  const { label, options, name, control, disabled } = props;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={''}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value || ''}
            label={label}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
          >
            {options.map((option) => (
              <MenuItem key={option.id} value={option.value}>
                {option.showValue || option.value}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
