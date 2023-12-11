import { useState } from "react";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Autocomplete } from "@mui/material";
import PropTypes from "prop-types";
import QRCode from "qrcode.react";
import { useEffect } from "react";
import { api } from "../../api";

const BuyTickets = ({ data, handleChange, handleSubmit: handleSalesSubmit, events, ticketTypes, ticket, setEventsWithCapacity }) => {
  const selectedEvent = events.find((e) => e.eventId.toString() === data.eventId);
  const selectedTicketType = ticketTypes.find((type) => type.ticketTypeId.toString() === data.ticketTypeId);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const matchingEvent = events.find((e) => e.eventId.toString() === data.eventId);
    setInputValue(matchingEvent ? `${matchingEvent.name} - ${matchingEvent.date}` : "");
  }, [data.eventId, events]);

  useEffect(() => {
    if (data.eventId) {
      updateTicketsSoldForEvent(data.eventId);
    }
  }, [data.eventId, events]);

  const updateTicketsSoldForEvent = async (eventId) => {
    try {
      const salesResponse = await api.get("/api/sales");
      const salesData = salesResponse.data;

      const updatedEvents = events.map((event) => {
        if (event.eventId.toString() === eventId) {
          const ticketsSoldForEvent = salesData.reduce((acc, sale) => {
            return sale.ticketList.some((ticket) => ticket.event.eventId.toString() === eventId) ? acc + sale.amount : acc;
          }, 0);

          return {
            ...event,
            ticketsSold: ticketsSoldForEvent,
            ticketsAvailable: Math.max(event.venue.capacity - ticketsSoldForEvent, 0),
          };
        }
        return event;
      });

      setEventsWithCapacity(updatedEvents);
    } catch (error) {
      console.error("Error updating tickets sold for event:", error);
    }
  };

  const totalTickets = parseInt(data.amount, 10) || 0;
  const pricePerTicket = selectedTicketType ? selectedTicketType.price : 0;
  const totalPrice = totalTickets * pricePerTicket;

  const TicketPrintLayout = ({ tickets }) => {
    if (!tickets) {
      return null;
    }

    return (
      <div style={{ display: "none" }} id="print-section">
        {tickets.map((ticket, index) => (
          <div key={index} style={{ pageBreakAfter: "always", padding: "20px" }}>
            {/* Display ticket details here */}
            <h3>Ticket ID: {ticket.ticketId}</h3>
            <p>Event: {ticket.event.name}</p>
            <p>Date: {ticket.event.date}</p>
            <p>Venue: {ticket.event.venue.name}</p>
            <p>Ticket Type: {ticket.ticketType.ticketName}</p>
            <text>dadadada</text>
            <QRCode value={ticket.barcode} size={128} includeMargin={true} className="qrcode-canvas" />
          </div>
        ))}
      </div>
    );
  };

  const handlePrint = () => {
    convertQRCodesToImages();

    setTimeout(() => {
      const printContent = document.getElementById("print-section");
      const WinPrint = window.open("", "", "width=900,height=650");
      WinPrint.document.write(printContent.innerHTML);
      WinPrint.document.close();
      WinPrint.focus();
      setTimeout(() => {
        WinPrint.print();
        WinPrint.close();
      }, 500); // Delay to ensure QR codes are rendered
    }, 500); // Delay to ensure QR codes are converted
  };

  const convertQRCodesToImages = () => {
    document.querySelectorAll(".qrcode-canvas").forEach((canvas) => {
      const img = document.createElement("img");
      img.src = canvas.toDataURL("image/png");
      canvas.replaceWith(img);
    });
  };

  return (
    <>
      <h1>Ticket purchase</h1>
      <form style={{ width: 500 }} onSubmit={handleSalesSubmit}>
        <TextField label="Amount" type="text" name="amount" value={data.amount} onChange={handleChange} margin="normal" fullWidth />

        <Autocomplete
          value={events.find((event) => event.eventId.toString() === data.eventId) || null}
          onChange={(event, newValue) => {
            handleChange({
              target: { name: "eventId", value: newValue ? newValue.eventId.toString() : "" },
            });
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={events}
          getOptionLabel={(option) => `${option.name} - ${option.date}`}
          renderInput={(params) => <TextField {...params} label="Event ID" margin="normal" />}
          fullWidth
          margin="normal"
        />

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
                  {type.ticketName} - {type.description} - {type.price} €
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {selectedEvent && <p>Tickets Available: {selectedEvent.ticketsAvailable}</p>}
        {selectedTicketType && (
          <>
            <p>Price per Ticket: ${pricePerTicket.toFixed(2)}</p>
            <p>Total Tickets: {totalTickets}</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
          </>
        )}
        <Button type="submit" variant="contained" color="primary" disabled={!data.eventId || !data.ticketTypeId || !data.amount} sx={{ my: 2 }}>
          Buy
        </Button>
        {ticket && ticket.ticketList && (
          <>
            <Button variant="contained" color="secondary" onClick={handlePrint} sx={{ m: 2 }}>
              Print Tickets
            </Button>
            <TicketPrintLayout tickets={ticket.ticketList} />
          </>
        )}
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
                  <QRCode value={ticketItem.barcode} size={128} includeMargin={true} className="qrcode-canvas" />
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
    event: PropTypes.shape({
      eventId: PropTypes.number,
      name: PropTypes.string,
      date: PropTypes.string,
      time: PropTypes.string,
      venue: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
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
  setEventsWithCapacity: PropTypes.func.isRequired,
};

export default BuyTickets;
