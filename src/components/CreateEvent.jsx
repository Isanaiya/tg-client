import { useState } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Modal, Box } from "@mui/material";
import PropTypes from "prop-types";

const CreateEvent = ({ open, handleClose, venues, handleCreateEvent }) => {
  const [eventData, setEventData] = useState({ name: "", date: "", time: "", venueId: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isFormValid = eventData.name && eventData.date && eventData.time && eventData.venueId;

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
        <h1>Create Event</h1>
        <form onSubmit={(e) => handleCreateEvent(e, eventData)}>
          <TextField label="Event Name" name="name" value={eventData.name} onChange={handleChange} margin="normal" fullWidth />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={eventData.date}
            onChange={handleChange}
            margin="normal"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Time"
            name="time"
            type="time"
            value={eventData.time}
            onChange={handleChange}
            margin="normal"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="venue-label">Venue</InputLabel>
            <Select labelId="venue-label" name="venueId" value={eventData.venueId} onChange={handleChange} label="Venue">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {venues.map((venue) => (
                <MenuItem key={venue.venueId} value={venue.venueId.toString()}>
                  {venue.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
            Create Event
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose} sx={{ m: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

CreateEvent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  venues: PropTypes.arrayOf(
    PropTypes.shape({
      venueId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string,
      city: PropTypes.string,
      capacity: PropTypes.number,
    })
  ).isRequired,
  handleCreateEvent: PropTypes.func.isRequired,
};

export default CreateEvent;
