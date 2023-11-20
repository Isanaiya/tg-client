import { Container, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const CreateEvent = ({ eventData, setEventData, venues, handleSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const isFormValid = eventData.name && eventData.date && eventData.time && eventData.venueId;

  return (
    <Container>
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>
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
      </form>
    </Container>
  );
};

CreateEvent.propTypes = {
  eventData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    venueId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  setEventData: PropTypes.func.isRequired,
  venues: PropTypes.arrayOf(
    PropTypes.shape({
      venueId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string,
      city: PropTypes.string,
      capacity: PropTypes.number,
    })
  ).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default CreateEvent;
