import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";

function App() {
  const [data, setData] = useState({
    amount: "",
    eventId: "",
    ticketTypeId: "",
  });

  const [sales, setSales] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  // Function to fetch sales data
  const fetchSalesData = async () => {
    try {
      const response = await axios.get("https://ticketguru-tg.rahtiapp.fi/api/sales", {
        headers: {
          Authorization: `Basic ${btoa("admin:admin")}`,
        },
      });
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales data: ", error);
    }
  };

  // Use useEffect to fetch sales data on component mount
  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ticketData = {
      ticketAmount: data.amount,
      ticketEventId: data.eventId,
      typeId: data.ticketTypeId,
    };

    try {
      const response = await axios.post(
        "https://ticketguru-tg.rahtiapp.fi/api/sales",
        {
          amount: ticketData.ticketAmount,
          ticketList: [
            {
              event: {
                eventId: ticketData.ticketEventId,
              },
              ticketType: {
                ticketTypeId: ticketData.typeId,
              },
            },
          ],
        },
        {
          headers: {
            Authorization: `Basic ${btoa("admin:admin")}`,
          },
        }
      );
      console.log("data", response.data);
      setSnackbar({ open: true, message: "Purchase successful!", severity: "success" });
      // Fetch the updated sales data after a successful POST request
      fetchSalesData();
    } catch (error) {
      console.error("Error submitting data: ", error);
      setSnackbar({ open: true, message: "Purchase failed!", severity: "error" });
    }
  };

  useEffect(() => {
    const fetchEventsAndTicketTypes = async () => {
      try {
        const eventsResponse = await axios.get("https://ticketguru-tg.rahtiapp.fi/api/events", {
          headers: {
            Authorization: `Basic ${btoa("admin:admin")}`,
          },
        });
        setEvents(eventsResponse.data);

        const ticketTypesResponse = await axios.get("https://ticketguru-tg.rahtiapp.fi/api/tickettypes", {
          headers: {
            Authorization: `Basic ${btoa("admin:admin")}`,
          },
        });
        setTicketTypes(ticketTypesResponse.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchEventsAndTicketTypes();
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <h1>Ticket purchase</h1>
      <form onSubmit={handleSubmit}>
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

      <h2>Sales Data</h2>
      <TableContainer component={Paper}>
        <Table aria-label="sales data">
          <TableHead>
            <TableRow>
              <TableCell>Sale ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Ticket Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Barcode</TableCell>
              <TableCell>Checked In</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...sales].reverse().map((sale) =>
              sale.ticketList.map((ticket) => (
                <TableRow key={ticket.ticketId}>
                  <TableCell>{sale.saleEventId}</TableCell>
                  <TableCell>{sale.saleDate}</TableCell>
                  <TableCell>{sale.saleTime}</TableCell>
                  <TableCell>{sale.amount}</TableCell>
                  <TableCell>
                    {ticket.event.name} on {ticket.event.date} at {ticket.event.time}
                  </TableCell>
                  <TableCell>
                    {ticket.event.venue.name}, {ticket.event.venue.address}, {ticket.event.venue.city}
                  </TableCell>
                  <TableCell>
                    {ticket.ticketType.ticketName} - {ticket.ticketType.description}
                  </TableCell>
                  <TableCell>${ticket.ticketType.price.toFixed(2)}</TableCell>
                  <TableCell>{ticket.barcode}</TableCell>
                  <TableCell>{ticket.isChecked ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
