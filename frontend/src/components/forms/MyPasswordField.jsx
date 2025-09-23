import * as React from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";


export default function MyPasswordField(props) {
  const { label, name, control, id } = props;
  const [showPassword, setShowPassword] = React.useState(false);

  // Generate a unique ID if not provided
  const uniqueId = id || `outlined-adornment-password-${Math.random().toString(36).substring(2, 9)}`;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={""}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <FormControl className="myForm" variant="outlined">
          <InputLabel htmlFor={uniqueId}>{label}</InputLabel>
          <OutlinedInput
            id={uniqueId}
            onChange={onChange}
            value={value}
            error={!!error}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={label}
          />
          <FormHelperText sx={{ color: "#d32f2f" }}>
            {error?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
