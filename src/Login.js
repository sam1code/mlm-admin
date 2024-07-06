import React, { useEffect, useState } from "react";
import {
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  Snackbar,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Box, Grid, Paper } from "@mui/material";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { login } from "./api/interceptor";

const Login = () => {
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: "50vw",
    margin: "20px auto",
    maxWidth: "400px",
  };
  const avatarStyle = { backgroundColor: "#333" };
  const btnstyle = { margin: "8px 0" };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { authInfo, updateAuthInfo } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authInfo.isAuthenticated) {
      return navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await login(username, password);
      localStorage.setItem("token", response.data?.tokens?.token);
      localStorage.setItem("refreshToken", response.data?.tokens?.refreshToken);
      updateAuthInfo();
      navigate("/");
    } catch (err) {
      console.error(err);
      setOpen(true);
      setMessage("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "lightgrey",
      }}
    >
      <Paper elevation={10} style={paperStyle} mb={2}>
        <Grid align="center" mb={2}>
          <h2>MLM</h2>
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
        </Grid>
        <Box
          sx={{
            mb: 2,
          }}
        >
          <TextField
            label="email"
            placeholder="Enter Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>
        <TextField
          label="Password"
          placeholder="Enter password"
          type="password"
          variant="outlined"
          fullWidth
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          color="#000"
          variant="contained"
          style={btnstyle}
          fullWidth
          onClick={handleLogin}
          disabled={!username || !password || loading}
        >
          Sign in
        </Button>
        <Typography>
          <Link
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "15px",
            }}
            href="#"
          >
            Forgot password ?
          </Link>
        </Typography>
        <Typography
          style={{
            textDecoration: "none",
            color: "black",
            fontSize: "15px",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          {" "}
          Do you have an account?{" "}
          <Link
            style={{
              color: "black",
              fontSize: "15px",
              textDecoration: "underline",
            }}
            href="/signup"
          >
            Sign Up
          </Link>
        </Typography>
      </Paper>
      <Snackbar open={open} autoHideDuration={6000} message={message} />
    </Grid>
  );
};

export default Login;
