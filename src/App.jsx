import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Alert, Snackbar, Tabs, Tab, Box } from "@mui/material";
import BuyTickets from "./components/BuyTickets";
import PurchaseHistory from "./components/PurchaseHistory";
import CreateEvent from "./components/Events";

function App() {
  const [salesData, setSalesData] = useState({
    amount: "",
    eventId: "",
    ticketTypeId: "",
  });
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    time: "",
    venueId: "",
  });

  const [sales, setSales] = useState([]);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [currentTab, setCurrentTab] = useState("buyTickets");

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSalesData({
      ...salesData,
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

  const handleSalesSubmit = async (e) => {
    e.preventDefault();
    const ticketData = {
      ticketAmount: salesData.amount,
      ticketEventId: salesData.eventId,
      typeId: salesData.ticketTypeId,
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

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: eventData.name,
      date: eventData.date,
      time: eventData.time,
      venue: { venueId: parseInt(eventData.venueId) },
    };

    try {
      const response = await axios.post("https://ticketguru-tg.rahtiapp.fi/api/events", payload, {
        headers: {
          Authorization: `Basic ${btoa("admin:admin")}`,
        },
      });
      console.log("Event created:", response.data);
      setSnackbar({ open: true, message: "Event created successfully!", severity: "success" });
      setEventData({
        name: "",
        date: "",
        time: "",
        venueId: "",
      });
    } catch (error) {
      console.error("Failed to create event:", error);
      setSnackbar({ open: true, message: "Failed to create event.", severity: "error" });
    }
  };

  const handleCreateTicketType = async (e, ticketTypeData) => {
    e.preventDefault();
    // Format your payload as required by your API
    const payload = {
      price: Number(ticketTypeData.price),
      ticketName: ticketTypeData.ticketName,
      description: ticketTypeData.description,
      event: {
        eventId: Number(ticketTypeData.eventId),
      },
    };

    try {
      const response = await axios.post("http://ticketguru-tg.rahtiapp.fi/api/tickettypes", payload, {
        headers: {
          Authorization: `Basic ${btoa("admin:admin")}`,
        },
      });
      console.log("Ticket type created:", response.data);
      setSnackbar({ open: true, message: "Ticket type created successfully!", severity: "success" });
    } catch (error) {
      console.error("Failed to create ticket type:", error);
      setSnackbar({ open: true, message: "Failed to create ticket type.", severity: "error" });
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

        const venuesResponse = await axios.get("https://ticketguru-tg.rahtiapp.fi/api/venues", {
          headers: {
            Authorization: `Basic ${btoa("admin:admin")}`,
          },
        });
        setVenues(venuesResponse.data);
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

  const renderTabContent = () => {
    switch (currentTab) {
      case "buyTickets":
        return <BuyTickets {...{ data: salesData, setData: setSalesData, handleChange, handleSubmit: handleSalesSubmit, events, ticketTypes }} />;
      case "createEvent":
        return <CreateEvent {...{ eventData, setEventData, venues, handleSubmit: handleEventSubmit, events, handleCreateTicketType }} />;
      case "purchaseHistory":
        return <PurchaseHistory {...{ sales }} />;
      default:
        return null;
    }
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
      <Tabs value={currentTab} onChange={handleTabChange} centered>
        <Tab label="Buy Tickets" value="buyTickets" />
        <Tab label="Create Event" value="createEvent" />
        <Tab label="Purchase History" value="purchaseHistory" />
      </Tabs>

      <Box sx={{ paddingTop: 2 }}>{renderTabContent()}</Box>
    </Container>
  );
}

export default App;
