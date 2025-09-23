import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import CircularProgress from "@mui/material/CircularProgress";

import MyTextField from "../MyTextField";
import MyPasswordField from "../MyPasswordField";
import MyButton from "../MyButton";

const UserEmailForm = ({submission, isSubmitting}) => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Field expected an email address")
      .required("Email is required"),
  });
  const resolvedSchema = yupResolver(schema);
  const { handleSubmit, control } = useForm({
    resolver: resolvedSchema,
  });

  return (
    <div className={"myBackground"}>
      <form onSubmit={handleSubmit(submission)}>
        <Box className={"whiteBox"}
          sx={{
            opacity: isSubmitting ? 0.7 : 1,
            pointerEvents: isSubmitting ? "none" : "auto",
          }}>
          <Box className={"itemBox"}>
            <Box className={"title"}>Request Password Reset</Box>
          </Box>
          <Box className={"itemBox"}>
            <MyTextField label={"Email"} name={"email"} control={control} />
          </Box>
          <Box className={"itemBox"}>
            <MyButton 
              label={isSubmitting ? "Sending..." :"Send Reset Link"} 
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              type={"submit"} 
            />
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default UserEmailForm;
