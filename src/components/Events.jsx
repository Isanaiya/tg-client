import { useState } from "react";
import { Container, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const CreateEvent = ({ eventData, setEventData, venues, handleSubmit, events, handleCreateTicketType }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const isFormValid = eventData.name && eventData.date && eventData.time && eventData.venueId;

  const [ticketTypeData, setTicketTypeData] = useState({
    price: "",
    ticketName: "",
    description: "",
    eventId: "",
  });

  const handleChangeTicketType = (e) => {
    const { name, value } = e.target;
    setTicketTypeData({ ...ticketTypeData, [name]: value });
  };

  const isTicketTypeFormValid = ticketTypeData.price && ticketTypeData.ticketName && ticketTypeData.description && ticketTypeData.eventId;

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
      <h2>Create Ticket Type</h2>
      <form onSubmit={(e) => handleCreateTicketType(e, ticketTypeData)}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="event-select-label">Event</InputLabel>
          <Select labelId="event-select-label" name="eventId" value={ticketTypeData.eventId} onChange={handleChangeTicketType} label="Event">
            {events.map((event) => (
              <MenuItem key={event.eventId} value={event.eventId}>
                {event.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Ticket Name"
          name="ticketName"
          value={ticketTypeData.ticketName}
          onChange={handleChangeTicketType}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={ticketTypeData.description}
          onChange={handleChangeTicketType}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={ticketTypeData.price}
          onChange={handleChangeTicketType}
          margin="normal"
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary" disabled={!isTicketTypeFormValid}>
          Create Ticket Type
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
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleCreateTicketType: PropTypes.func.isRequired,
};

export default CreateEvent;
