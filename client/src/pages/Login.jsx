import { Container, TextField, Button, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    let tempErrors = {};

    if (!email) tempErrors.email = "Email is required";
    if (!password) tempErrors.password = "Password is required";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role == "admin") {
        navigate("/admin/AdminDashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.match) {
        alert(err.response.data.match);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <h2>Login</h2>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth variant="contained" onClick={submit}>
            Login
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
