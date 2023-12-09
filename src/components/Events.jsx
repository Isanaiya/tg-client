import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, Box, IconButton, Button } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import PropTypes from "prop-types";
import CreateEvent from "./CreateEvent";
import CreateTicketType from "./CreateTicketType";

const Events = ({ events, ticketTypes, venues, handleCreateEvent, handleCreateTicketType }) => {
  const [open, setOpen] = useState(false);
  const [openNewEventModal, setOpenNewEventModal] = useState(false);
  const [openNewTicketTypeModal, setOpenNewTicketTypeModal] = useState(false);

  const handleOpenNewEventModal = () => setOpenNewEventModal(true);
  const handleCloseNewEventModal = () => setOpenNewEventModal(false);

  const handleOpenNewTicketTypeModal = () => setOpenNewTicketTypeModal(true);
  const handleCloseNewTicketTypeModal = () => setOpenNewTicketTypeModal(false);

  const handleClick = (eventId) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [eventId]: !prevOpen[eventId],
    }));
  };

  const getTicketTypesForEvent = (eventId) => {
    return ticketTypes.filter((type) => type.event.eventId.toString() === eventId);
  };

  return (
    <>
      <h1>Events</h1>
      <Button variant="contained" color="primary" onClick={handleOpenNewEventModal}>
        New Event
      </Button>
      <Button variant="contained" color="primary" onClick={handleOpenNewTicketTypeModal} sx={{ m: 2 }}>
        New Ticket Type
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="events data">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Event ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Venue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <React.Fragment key={event.eventId}>
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleClick(event.eventId)}>
                      {open[event.eventId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{event.eventId}</TableCell>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.venue.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open[event.eventId]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Table size="small" aria-label="ticket types">
                          <TableBody>
                            {getTicketTypesForEvent(event.eventId.toString()).map((ticketType) => (
                              <TableRow key={ticketType.ticketTypeId}>
                                <TableCell component="th" scope="row">
                                  Ticket Type: {ticketType.ticketName}
                                </TableCell>
                                <TableCell>Description: {ticketType.description}</TableCell>
                                <TableCell>Price: ${ticketType.price.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateEvent open={openNewEventModal} handleClose={handleCloseNewEventModal} venues={venues} handleCreateEvent={handleCreateEvent} />
      <CreateTicketType
        open={openNewTicketTypeModal}
        handleClose={handleCloseNewTicketTypeModal}
        events={events}
        handleCreateTicketType={handleCreateTicketType}
      />
    </>
  );
};

Events.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      venue: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  ticketTypes: PropTypes.arrayOf(
    PropTypes.shape({
      ticketTypeId: PropTypes.number.isRequired,
      ticketName: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      event: PropTypes.shape({
        eventId: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
  venues: PropTypes.arrayOf(
    PropTypes.shape({
      venueId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string,
      city: PropTypes.string,
      capacity: PropTypes.number,
    })
  ).isRequired,
  handleCreateEvent: PropTypes.func.isRequired,
  handleCreateTicketType: PropTypes.func.isRequired,
};

export default Events;
