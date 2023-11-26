import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Alert, Snackbar, Tabs, Tab, Box, Button } from "@mui/material";
import BuyTickets from "./components/BuyTickets";
import PurchaseHistory from "./components/PurchaseHistory";
import CreateEvent from "./components/Events";

function App() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loggedIn, setLoggedIn] = useState(false);

  const onLoginSuccess = () => {
    setLoggedIn(true);
    fetchEventsAndTicketTypes();
    fetchSalesData();
  };

  const promptForCredentials = () => {
    const username = window.prompt("Enter your username");
    const password = window.prompt("Enter your password");
    setCredentials({ username, password });
  };

  const setupAxiosInterceptors = (creds) => {
    axios.interceptors.request.use((config) => {
      const token = `Basic ${btoa(`${creds.username}:${creds.password}`)}`;
      config.headers.Authorization = token;
      return config;
    });
  };

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

  const login = async () => {
    try {
      const response = await axios.get("https://ticketguru-tg.rahtiapp.fi/api/users");
      console.log("Login response:", response);
      onLoginSuccess();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    setCredentials({ username: "", password: "" });
    setLoggedIn(false);
    axios.interceptors.request.use((config) => {
      delete config.headers.Authorization;
      return config;
    });
    setSales([]);
    setEvents([]);
    setVenues([]);
    setTicketTypes([]);
  };

  useEffect(() => {
    if (credentials.username && credentials.password) {
      setupAxiosInterceptors(credentials);
      login();
    }
  }, [credentials]);

  const [sales, setSales] = useState([]);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [ticket, setTicket] = useState(null);

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

  const fetchSalesData = async () => {
    try {
      const response = await axios.get("https://ticketguru-tg.rahtiapp.fi/api/sales");
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales data: ", error);
    }
  };

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
      const postResponse = await axios.post("https://ticketguru-tg.rahtiapp.fi/api/sales", {
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
      });
      console.log("POST response data", postResponse.data);

      const saleEventId = postResponse.data.saleEventId;
      if (saleEventId) {
        const getResponse = await axios.get(`https://ticketguru-tg.rahtiapp.fi/api/sales/${saleEventId}`);
        console.log("GET response data", getResponse.data);
        setTicket(getResponse.data);
      }
      setSnackbar({ open: true, message: "Purchase successful!", severity: "success" });
    } catch (error) {
      console.error("Error during the sale process: ", error);
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
      const response = await axios.post("https://ticketguru-tg.rahtiapp.fi/api/events", payload, {});
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
    const payload = {
      price: Number(ticketTypeData.price),
      ticketName: ticketTypeData.ticketName,
      description: ticketTypeData.description,
      event: {
        eventId: Number(ticketTypeData.eventId),
      },
    };

    try {
      const response = await axios.post("https://ticketguru-tg.rahtiapp.fi/api/tickettypes", payload);
      console.log("Ticket type created:", response.data);
      setSnackbar({ open: true, message: "Ticket type created successfully!", severity: "success" });
    } catch (error) {
      console.error("Failed to create ticket type:", error);
      setSnackbar({ open: true, message: "Failed to create ticket type.", severity: "error" });
    }
  };

  const fetchEventsAndTicketTypes = async () => {
    try {
      const eventsResponse = await axios.get("https://ticketguru-tg.rahtiapp.fi/api/events");
      setEvents(eventsResponse.data);
      console.log(events);
      const ticketTypesResponse = await axios.get("https://ticketguru-tg.rahtiapp.fi/api/tickettypes");
      setTicketTypes(ticketTypesResponse.data);

      const venuesResponse = await axios.get("https://ticketguru-tg.rahtiapp.fi/api/venues");
      setVenues(venuesResponse.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const renderTabContent = () => {
    if (!loggedIn) {
      return <div>Please login</div>;
    }
    switch (currentTab) {
      case "buyTickets":
        return <BuyTickets {...{ data: salesData, setData: setSalesData, handleChange, handleSubmit: handleSalesSubmit, events, ticketTypes, ticket }} />;
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
      {loggedIn ? <Button onClick={logout}>Logout</Button> : <Button onClick={promptForCredentials}>Login</Button>}
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
