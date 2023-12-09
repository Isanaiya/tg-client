import { useState } from "react";
import { Box, Button, ButtonGroup, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";

function LoginScreen({ onLogin, error }) {
  const [role, setRole] = useState("TicketSeller");
  const [password, setPassword] = useState("");

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    await onLogin(role, password);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={2}>
      <Typography variant="h5" mb={2}>
        Login as:
      </Typography>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button variant={role === "TicketSeller" ? "contained" : "outlined"} onClick={() => handleRoleSelection("TicketSeller")}>
          TicketSeller
        </Button>
        <Button variant={role === "Admin" ? "contained" : "outlined"} onClick={() => handleRoleSelection("Admin")}>
          Admin
        </Button>
      </ButtonGroup>
      <TextField label="Password" type="password" value={password} onChange={handlePasswordChange} sx={{ mt: 2, width: "100%" }} />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
}

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default LoginScreen;
