import { TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import PropTypes from "prop-types";

const BuyTickets = ({ data, handleChange, handleSubmit: handleSalesSubmit, events, ticketTypes }) => {
  return (
    <>
      <h1>Ticket purchase</h1>
      <form onSubmit={handleSalesSubmit}>
        <TextField label="Amount" type="text" name="amount" value={data.amount} onChange={handleChange} margin="normal" fullWidth />

        <FormControl fullWidth margin="normal">
          <InputLabel id="event-label">Event ID</InputLabel>
          <Select labelId="event-label" id="event-select" name="eventId" value={data.eventId} onChange={handleChange} label="Event ID">
            <MenuItem value="">
              <em>Select Event</em>
            </MenuItem>
            {events.map((event) => (
              <MenuItem key={event.eventId} value={event.eventId.toString()}>
                {event.name} - {event.date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="ticket-type-label">Ticket Type</InputLabel>
          <Select
            labelId="ticket-type-label"
            id="ticketType-select"
            name="ticketTypeId"
            value={data.ticketTypeId}
            onChange={handleChange}
            label="Ticket Type"
          >
            <MenuItem value="">
              <em>Select Ticket Type</em>
            </MenuItem>
            {ticketTypes
              .filter((type) => type.event.eventId.toString() === data.eventId)
              .map((type) => (
                <MenuItem key={type.ticketTypeId} value={type.ticketTypeId.toString()}>
                  {type.ticketName} - {type.description}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" disabled={!data.eventId || !data.ticketTypeId || !data.amount}>
          Buy
        </Button>
      </form>
    </>
  );
};

BuyTickets.propTypes = {
  data: PropTypes.shape({
    amount: PropTypes.string,
    eventId: PropTypes.string,
    ticketTypeId: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ),
  ticketTypes: PropTypes.arrayOf(
    PropTypes.shape({
      ticketTypeId: PropTypes.number.isRequired,
      ticketName: PropTypes.string.isRequired,
      description: PropTypes.string,
      event: PropTypes.shape({
        eventId: PropTypes.number.isRequired,
      }),
    })
  ),
};

export default BuyTickets;
