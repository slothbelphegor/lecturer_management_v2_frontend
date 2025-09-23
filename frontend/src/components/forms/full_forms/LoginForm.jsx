import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import MyTextField from "../MyTextField";
import MyPasswordField from "../MyPasswordField";
import MyButton from "../MyButton";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Login = ({submission, isSubmitting}) => {


  const schema = yup.object().shape({
    username_or_email: yup.string().required("Username or email is required"),
    password: yup.string().required("Password is required"),
  });
  const resolvedSchema = yupResolver(schema);
  const { handleSubmit, control } = useForm({
    resolver: resolvedSchema,
  });

  return (
    <div className={"myBackground"}>
      <form onSubmit={handleSubmit(submission)}>
        <Box className={"whiteBox"}>
          <Box className={"itemBox"}>
            <Box className={"title"}>Login</Box>
          </Box>
          <Box className={"itemBox"}>
            <MyTextField
              label="Username or email"
              name={"username_or_email"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyPasswordField
              label="Password"
              name={"password"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyButton 
              label={isSubmitting ? "Login..." :"Login"} 
              type={"submit"} 
              disabled={isSubmitting}
              startIcon={isSubmitting  ? <CircularProgress size={20} /> : null}/>
          </Box>
          <Box className={"itemBox"} sx={{ flexDirection: "column" }}>
            <Link to={"/register"}>Here for applying as a lecturer? Register here</Link>
            <Link to={"/request_password_reset"}>Forget Password?</Link>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default Login;
