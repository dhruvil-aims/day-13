import { Container, TextField, Button, Card, CardContent } from "@mui/material";
import { useState } from "react";
import API from "../services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    let tempErrors = {};

    if (!form.name) tempErrors.name = "Name is required";
    if (!form.email) tempErrors.email = "Email is required";
    if (!form.password) tempErrors.password = "Password is required";
    if (form.password && form.password.length < 6)
      tempErrors.password = "Minimum 6 characters";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      // await API.post("/auth/register", form);
      await axios.post("https://day-13.onrender.com/auth/register", form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <h2>Register</h2>

          <TextField
            fullWidth
            label="Name"
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button fullWidth variant="contained" onClick={submit}>
            Register
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
