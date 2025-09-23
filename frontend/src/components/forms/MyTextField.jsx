import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form'

export default function MyTextField(props) {
    const { label, name, control, slotProps, sx, disabled, id } = props
    // Generate a unique ID if not provided
    const uniqueId = id || `outlined-basic-${Math.random().toString(36).substring(2, 9)}`;
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={""}
            render={({
                field: { onChange, value },
                fieldState: { error }
            }) => (
                <TextField
                    id={uniqueId}
                    sx={sx}
                    label={label}
                    variant="outlined"
                    className={"myForm"}
                    onChange={onChange}
                    slotProps={slotProps}
                    value={value}
                    error={!!error}
                    disabled={disabled}
                    helperText={error?.message}
                />
            )
            }
        />


    );
}