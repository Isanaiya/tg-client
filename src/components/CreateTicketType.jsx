import { useState, useEffect } from "react";
import { TextField, Button, Box, Autocomplete, Modal } from "@mui/material";
import PropTypes from "prop-types";

const CreateTicketType = ({ open, handleClose, events, handleCreateTicketType }) => {
  const [ticketTypeData, setTicketTypeData] = useState({
    price: "",
    ticketName: "",
    description: "",
    eventId: "",
  });

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const matchingEvent = events.find((e) => e.eventId.toString() === ticketTypeData.eventId);
    setInputValue(matchingEvent ? `${matchingEvent.name} - ${matchingEvent.date}` : "");
  }, [ticketTypeData.eventId, events]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketTypeData({ ...ticketTypeData, [name]: value });
  };

  const isTicketTypeFormValid = ticketTypeData.price && ticketTypeData.ticketName && ticketTypeData.description && ticketTypeData.eventId;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        style={{
          backgroundColor: "white",
          margin: "auto",
          padding: "50px",
          outline: "none",
          position: "absolute",
          borderRadius: 15,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h1>Create Ticket Type</h1>
        <form onSubmit={(e) => handleCreateTicketType(e, ticketTypeData)}>
          <Autocomplete
            value={events.find((event) => event.eventId.toString() === ticketTypeData.eventId) || null}
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
            renderInput={(params) => <TextField {...params} label="Event" margin="normal" />}
            fullWidth
            margin="normal"
          />
          <TextField label="Ticket Name" name="ticketName" value={ticketTypeData.ticketName} onChange={handleChange} margin="normal" fullWidth />
          <TextField label="Description" name="description" value={ticketTypeData.description} onChange={handleChange} margin="normal" fullWidth />
          <TextField label="Price" name="price" type="number" value={ticketTypeData.price} onChange={handleChange} margin="normal" fullWidth />

          <Button type="submit" variant="contained" color="primary" disabled={!isTicketTypeFormValid}>
            Create Ticket Type
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose} sx={{ m: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

CreateTicketType.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleCreateTicketType: PropTypes.func.isRequired,
};

export default CreateTicketType;
