import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import PropTypes from "prop-types";
import CreateVenue from "./CreateVenue";

const Venues = ({ venues, handleCreateVenue }) => {
  const [openNewVenueModal, setOpenNewVenueModal] = useState(false);

  const handleOpenNewVenueModal = () => setOpenNewVenueModal(true);
  const handleCloseNewVenueModal = () => setOpenNewVenueModal(false);

  return (
    <>
      <h1>Venues</h1>
      <Button variant="contained" color="primary" onClick={handleOpenNewVenueModal} sx={{ my: 2 }}>
        New Venue
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="venues data">
          <TableHead>
            <TableRow>
              <TableCell>Venue ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Capacity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venues.map((venue) => (
              <TableRow key={venue.venueId}>
                <TableCell>{venue.venueId}</TableCell>
                <TableCell>{venue.name}</TableCell>
                <TableCell>{venue.address}</TableCell>
                <TableCell>{venue.city}</TableCell>
                <TableCell>{venue.capacity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateVenue open={openNewVenueModal} handleClose={handleCloseNewVenueModal} handleCreateVenue={handleCreateVenue} />
    </>
  );
};

Venues.propTypes = {
  venues: PropTypes.arrayOf(
    PropTypes.shape({
      venueId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string,
      city: PropTypes.string,
      capacity: PropTypes.number,
    })
  ).isRequired,
  handleCreateVenue: PropTypes.func.isRequired,
};

export default Venues;
