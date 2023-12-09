import { useState, useEffect } from "react";
import { Container, Alert, Snackbar, AppBar, Toolbar, Tabs, Tab, Box, Button, Typography } from "@mui/material";
import BuyTickets from "./components/BuyTickets";
import PurchaseHistory from "./components/PurchaseHistory";
import Events from "./components/Events";
import Venues from "./components/Venues";
import LoginScreen from "./components/LoginScreen";
import { api, setCredentials as setApiCredentials } from "../api";

function App() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loggedIn, setLoggedIn] = useState(false);
  const [sales, setSales] = useState([]);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [eventsWithCapacity, setEventsWithCapacity] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [currentTab, setCurrentTab] = useState("buyTickets");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    setApiCredentials(credentials.username, credentials.password);
  }, [credentials]);

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

  const onLoginSuccess = () => {
    setLoggedIn(true);
    fetchDataPostLogin();
  };

  useEffect(() => {
    if (credentials.username && credentials.password) {
      performLogin();
    }
  }, [credentials]);

  const handleLogin = (role, password) => {
    setCredentials({ username: role, password: password });
  };

  const performLogin = async () => {
    try {
      const response = await api.get("/api/events");
      console.log("Login response:", response.status);
      if (response.status === 200) {
        onLoginSuccess();
        setLoginError("");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response && error.response.status === 401 ? "Incorrect username or password." : "Login failed. Please try again later.";
      setLoginError(errorMessage);
    }
  };

  const handleLogout = () => {
    setCredentials({ username: "", password: "" });
    setLoggedIn(false);
    setSales([]);
    setEvents([]);
    setVenues([]);
    setTicketTypes([]);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "eventId") {
      setSalesData({
        ...salesData,
        ticketTypeId: "",
        [name]: value,
      });
    } else {
      setSalesData({
        ...salesData,
        [name]: value,
      });
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await api.get("/api/sales");
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales data: ", error);
    }
  };

  const fetchDataPostLogin = () => {
    fetchEventsAndTicketTypes();
    fetchSalesData();
    fetchEventsAndVenueCapacity();
  };

  const handleSalesSubmit = async (e) => {
    e.preventDefault();
    const ticketData = {
      ticketAmount: salesData.amount,
      ticketEventId: salesData.eventId,
      typeId: salesData.ticketTypeId,
    };

    try {
      const postResponse = await api.post("/api/sales", {
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

      const saleEventId = postResponse.data.saleEventId;
      if (saleEventId) {
        const getResponse = await api.get(`/api/sales/${saleEventId}`);
        setTicket(getResponse.data);
      }
      setSnackbar({ open: true, message: "Purchase successful!", severity: "success" });
    } catch (error) {
      console.error("Error during the sale process: ", error);
      setSnackbar({ open: true, message: "Purchase failed!", severity: "error" });
    }
  };

  const handleCreateEvent = async (e, eventData) => {
    e.preventDefault();

    const payload = {
      name: eventData.name,
      date: eventData.date,
      time: eventData.time,
      venue: { venueId: parseInt(eventData.venueId) },
    };

    console.log(payload);
    try {
      const response = await api.post("/api/events", payload, {});
      setSnackbar({ open: true, message: "Event created successfully!", severity: "success" });
      setEventData({
        name: "",
        date: "",
        time: "",
        venueId: "",
      });

      if (response.status === 200) {
        fetchEventsAndVenueCapacity();
      }
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
      const response = await api.post("/api/tickettypes", payload);
      console.log("Ticket type created:", response.data);
      setSnackbar({ open: true, message: "Ticket type created successfully!", severity: "success" });
    } catch (error) {
      console.error("Failed to create ticket type:", error);
      setSnackbar({ open: true, message: "Failed to create ticket type.", severity: "error" });
    }
  };

  const handleCreateVenue = async (e, venueData) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/venues", venueData);
      console.log("Venue created:", response.data);
      setSnackbar({ open: true, message: "Venue created successfully!", severity: "success" });
    } catch (error) {
      console.error("Failed to create venue:", error);
      setSnackbar({ open: true, message: "Failed to create venue.", severity: "error" });
    }
  };

  const fetchEventsAndTicketTypes = async () => {
    try {
      const eventsResponse = await api.get("/api/events");
      setEvents(eventsResponse.data);
      const ticketTypesResponse = await api.get("/api/tickettypes");
      setTicketTypes(ticketTypesResponse.data);

      const venuesResponse = await api.get("/api/venues");
      setVenues(venuesResponse.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchEventsAndVenueCapacity = async () => {
    try {
      const eventsResponse = await api.get("/api/events");
      const eventsWithCapacityData = eventsResponse.data.map((event) => ({
        ...event,
        ticketsSold: 0,
        ticketsAvailable: event.venue.capacity,
      }));
      setEventsWithCapacity(eventsWithCapacityData);
    } catch (error) {
      console.error("Error fetching events: ", error);
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
      return <LoginScreen onLogin={handleLogin} error={loginError} />;
    }
    switch (currentTab) {
      case "buyTickets":
        return (
          <BuyTickets
            {...{
              data: salesData,
              setData: setSalesData,
              handleChange,
              handleSubmit: handleSalesSubmit,
              events: eventsWithCapacity,
              ticketTypes,
              ticket,
            }}
            setEventsWithCapacity={setEventsWithCapacity}
          />
        );
      case "eventsList":
        return <Events {...{ eventData, ticketTypes, setEventData, venues, handleCreateEvent, events, handleCreateTicketType }} />;
      case "venuesList":
        return <Venues venues={venues} handleCreateVenue={handleCreateVenue} />;
      case "purchaseHistory":
        return <PurchaseHistory {...{ sales }} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TICKETGURU
          </Typography>

          {loggedIn ? (
            <>
              <Tabs value={currentTab} onChange={handleTabChange} centered textColor="inherit">
                <Tab label="Buy Tickets" value="buyTickets" />
                <Tab label="Events" value="eventsList" />
                <Tab label="Venues" value="venuesList" />
                <Tab label="Purchase History" value="purchaseHistory" />
              </Tabs>
              <Box flexGrow={1} /> {/* This Box pushes the following elements to the right */}
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            </>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
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

        <Box sx={{ paddingTop: 2 }}>{renderTabContent()}</Box>
      </Container>
    </>
  );
}

export default App;
