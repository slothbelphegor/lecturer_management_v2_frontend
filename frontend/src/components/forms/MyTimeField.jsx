import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from '@mui/x-date-pickers/TimePicker'; 
import { Controller } from "react-hook-form";

export default function MyTimeField(props) {
  const {
    label,
    name,
    control,
    disabled,
    sx,
    onChange: customOnChange,
  } = props;


  const parseTimeString = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    
    try {
      const today = new Date();
      if (typeof value === 'string') {
        const [hours, minutes] = value.split(':').map(Number);
        today.setHours(hours, minutes, 0, 0);
        return today;
      }
      return null;
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
          <TimePicker 
            className="myForm" 
            label={label} 
            views={['hours', 'minutes']}
            ampm={false}
            sx={sx}
            disabled={disabled}
            value={parseTimeString(value)}
            onChange={(time) => {
              const timeString = time ? 
                `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}` 
                : null;
              onChange(timeString); // Update form state
              if (customOnChange) customOnChange(timeString); // Call custom handler if provided
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
