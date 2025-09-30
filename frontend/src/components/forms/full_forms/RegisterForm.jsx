import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import CircularProgress from "@mui/material/CircularProgress";

import MyTextField from "../MyTextField";
import MyPasswordField from "../MyPasswordField";
import MyButton from "../MyButton";

const RegisterForm = ({ submission, isSubmitting }) => {
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup
      .string()
      .email("Field expected an email address")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .matches(/[0-9]/, "Password must contain at least 1 number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least 1 special character"
      ),
    password2: yup
      .string()
      .required("Password confirmation is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });
  const resolvedSchema = yupResolver(schema);
  const { handleSubmit, control } = useForm({
    resolver: resolvedSchema,
  });

  return (
    <div className={"myBackground"}>
      <form onSubmit={handleSubmit(submission)}>
        <Box
          className={"whiteBox"}
          sx={{
            opacity: isSubmitting ? 0.7 : 1,
            pointerEvents: isSubmitting ? "none" : "auto",
          }}
        >
          <Box className={"itemBox"}>
            <Box className={"title"}>Register</Box>
          </Box>
          <Box className={"itemBox"}>
            <MyTextField
              label={"Username"}
              name={"username"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyTextField label={"Email"} name={"email"} control={control} />
          </Box>
          <Box className={"itemBox"}>
            <MyPasswordField
              label={"Password"}
              name={"password"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyPasswordField
              label={"Confirm Password"}
              name={"password2"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyButton
              label={isSubmitting ? "Registering..." : "Register"}
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

export default RegisterForm;
