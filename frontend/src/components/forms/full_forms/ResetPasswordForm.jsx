import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import CircularProgress from "@mui/material/CircularProgress";
import MyPasswordField from "../MyPasswordField";
import MyButton from "../MyButton";

const ResetPasswordForm = ({ submission, isSubmitting }) => {
  const schema = yup.object().shape({
    new_password: yup
      .string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .matches(/[0-9]/, "Password must contain at least 1 number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least 1 special character"
      ),
    retype_new_password: yup
      .string()
      .required("Password confirmation is required")
      .oneOf([yup.ref("new_password"), null], "Passwords must match"),
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
            <Box className={"title"}>Reset Password</Box>
          </Box>
          {/* <Box className={"itemBox"}>
            <MyPasswordField
              label={"Old password"}
              name={"old_password"}
              control={control}
            />
          </Box> */}
          
          <Box className={"itemBox"}>
            <MyPasswordField
              label={"New password"}
              name={"new_password"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyPasswordField
              label={"Confirm new password"}
              name={"retype_new_password"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyButton
              label={isSubmitting ? "Submitting..." : "Submit"}
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

export default ResetPasswordForm;
