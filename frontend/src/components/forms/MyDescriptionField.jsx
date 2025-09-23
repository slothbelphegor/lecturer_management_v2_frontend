import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export default function MyDescriptionField(props) {
  const { label, rows, name, control, disabled } = props
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={""}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <TextField
          id="outlined-multiline-static"
          sx={{ width: '100%' }}
          label={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          multiline
          rows={rows}
          disabled={disabled}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />

  );
}
