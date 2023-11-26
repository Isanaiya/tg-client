import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box } from "@mui/material";
import PropTypes from "prop-types";
import QRCode from "qrcode.react";

const BuyTickets = ({ data, handleChange, handleSubmit: handleSalesSubmit, events, ticketTypes, ticket }) => {
  return (
    <>
      <h1>Ticket purchase</h1>
      <form style={{ width: 500 }} onSubmit={handleSalesSubmit}>
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
     
      { ticket.length > 0 && (
        <Box>
          <h2>Ticket</h2>
          <QRCode value={ticket.ticketList.ticketId} size={256} includeMargin={true} />
          <p>Amount: {ticket.amount}</p>
          <p>Event: {ticket.ticketList.event.name} </p>
          <p>Date: {ticket.ticketList.event.date} </p>
          <p>Time: {ticket.ticketList.event.time} </p>
          <p>Venue: {ticket.ticketList.event.venue.name} </p>
          <p>Ticket type: {ticket.ticketList.ticketType.ticketName} </p>
          <p>Price: {ticket.ticketList.ticketType.price}</p>
        </Box> 
      )}

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
  ticket: PropTypes.arrayOf(
    PropTypes.shape({
      saleEventId: PropTypes.number.isRequired,
      saleDate: PropTypes.string.isRequired,
      saleTime: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      ticketList: PropTypes.arrayOf(
        PropTypes.shape({
          ticketId: PropTypes.number.isRequired,
          event: PropTypes.shape({
            name: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
            venue: PropTypes.shape({
              name: PropTypes.string.isRequired,
              address: PropTypes.string.isRequired,
              city: PropTypes.string.isRequired,
            }),
          }),
          ticketType: PropTypes.shape({
            ticketName: PropTypes.string.isRequired,
            description: PropTypes.string,
            price: PropTypes.number.isRequired,
          }),
          barcode: PropTypes.string.isRequired,
          isChecked: PropTypes.bool.isRequired,
        })
      ),
    })
  ),
};

export default BuyTickets;
