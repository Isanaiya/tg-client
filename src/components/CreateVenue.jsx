import { useState } from "react";
import { TextField, Button, Modal, Box } from "@mui/material";
import PropTypes from "prop-types";

const CreateVenue = ({ open, handleClose, handleCreateVenue }) => {
  const [venueData, setVenueData] = useState({ name: "", address: "", city: "", capacity: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenueData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isFormValid = venueData.name && venueData.address && venueData.city && venueData.capacity;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        style={{
          backgroundColor: "white",
          margin: "auto",
          padding: "50px",
          outline: "none",
          position: "absolute",
          borderRadius: "3%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h1>Create Venue</h1>
        <form onSubmit={(e) => handleCreateVenue(e, venueData)}>
          <TextField label="Venue Name" name="name" value={venueData.name} onChange={handleChange} margin="normal" fullWidth />
          <TextField label="Address" name="address" value={venueData.address} onChange={handleChange} margin="normal" fullWidth />
          <TextField label="City" name="city" value={venueData.city} onChange={handleChange} margin="normal" fullWidth />
          <TextField label="Capacity" name="capacity" type="number" value={venueData.capacity} onChange={handleChange} margin="normal" fullWidth />
          <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
            Create Venue
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose} sx={{ m: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

CreateVenue.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleCreateVenue: PropTypes.func.isRequired,
};

export default CreateVenue;
