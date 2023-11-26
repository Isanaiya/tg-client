import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box } from "@mui/material";
import PropTypes from "prop-types";
import QRCode from "qrcode.react";

const BuyTickets = ({ data, handleChange, handleSubmit: handleSalesSubmit, events, ticketTypes, ticket }) => {
  const selectedEvent = events.find((event) => event.eventId.toString() === data.eventId);

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
        {selectedEvent && <p>Tickets Available: {selectedEvent.ticketsAvailable}</p>}
        <Button type="submit" variant="contained" color="primary" disabled={!data.eventId || !data.ticketTypeId || !data.amount}>
          Buy
        </Button>
      </form>

      {ticket && (
        <Box>
          <h2>Ticket Purchase Details</h2>
          <p>Sale Event ID: {ticket.saleEventId}</p>
          <p>Sale Date: {ticket.saleDate}</p>
          <p>Sale Time: {ticket.saleTime}</p>
          <p>Amount: {ticket.amount}</p>

          {ticket.ticketList &&
            ticket.ticketList
              .filter((item) => typeof item === "object")
              .map((ticketItem, index) => (
                <Box key={ticketItem.ticketId || index} sx={{ marginTop: 2, border: "1px solid black", padding: 2 }}>
                  <p>Barcode: {ticketItem.barcode}</p>
                  {ticketItem.event && ticketItem.event.eventId && (
                    <>
                      <p>Event Name: {ticketItem.event.name || "N/A"}</p>
                      <p>Event Date: {ticketItem.event.date || "N/A"}</p>
                      <p>Event Time: {ticketItem.event.time || "N/A"}</p>
                      {ticketItem.event.venue && <p>Venue: {ticketItem.event.venue.name || "N/A"}</p>}
                    </>
                  )}
                  {ticketItem.ticketType && ticketItem.ticketType.ticketTypeId && (
                    <>
                      <p>Ticket Type: {ticketItem.ticketType.ticketName || "N/A"}</p>
                      <p>Price: {ticketItem.ticketType.price || "N/A"}</p>
                      <p>Description: {ticketItem.ticketType.description || "N/A"}</p>
                    </>
                  )}
                  <QRCode value={ticketItem.barcode} size={128} includeMargin={true} />
                </Box>
              ))}
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
  ticket: PropTypes.shape({
    saleEventId: PropTypes.number,
    saleDate: PropTypes.string,
    saleTime: PropTypes.string,
    amount: PropTypes.number,
    ticketList: PropTypes.arrayOf(
      PropTypes.shape({
        ticketId: PropTypes.number,
        barcode: PropTypes.string,
        isChecked: PropTypes.bool,
        event: PropTypes.shape({
          eventId: PropTypes.number,
          venue: PropTypes.shape({
            name: PropTypes.string,
          }),
          name: PropTypes.string,
          date: PropTypes.string,
          time: PropTypes.string,
        }),
        ticketType: PropTypes.shape({
          ticketTypeId: PropTypes.number,
          price: PropTypes.number,
          ticketName: PropTypes.string,
          description: PropTypes.string,
        }),
      })
    ),
  }),
};

export default BuyTickets;
