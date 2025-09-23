import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from "react-hook-form";
import { parse, isValid } from "date-fns";

export default function MyDateTimeField(props) {
  const {
    label,
    name,
    control,
    disabled,
    sx,
    onChange: customOnChange,
  } = props;

  const parseDateString = (value) => {
    if (!value) return null;
    if (value instanceof Date && isValid(value)) return value;
    
    try {
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      return isValid(parsedDate) ? parsedDate : null;
    } catch {
      return null;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker 
            className="myForm" 
            label={label} 
            sx={sx}
            disabled={disabled}
            value={parseDateString(value)}
            onChange={(date) => {
              onChange(date); // Update form state
              if (customOnChange) customOnChange(date); // Call custom handler if provided
            }}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error?.message,
              }
            }}/>
        </LocalizationProvider>
      )}
    />
  );
}
