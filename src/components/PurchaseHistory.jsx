import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
  IconButton,
  TablePagination,
  Button,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import PropTypes from "prop-types";

const PurchaseHistory = ({ sales }) => {
  const [open, setOpen] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState("saleDate");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedSales = [...sales].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (saleId) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [saleId]: !prevOpen[saleId],
    }));
  };

  const handlePrintTickets = (sale) => {
    // Generate print layout for the given sale
    const printLayout = generatePrintLayout(sale);
    const printWindow = window.open("", "", "width=900,height=650");
    printWindow.document.write(printLayout);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const generatePrintLayout = (sale) => {
    // Generate a layout for printing tickets of a specific sale
    return sale.ticketList
      .map(
        (ticket, index) =>
          `<div key=${index} style="page-break-after: always; padding: 20px;">
        <h3>Ticket ID: ${ticket.ticketId}</h3>
        <p>Event: ${ticket.event.name}</p>
        <p>Venue: ${ticket.event.venue.name}</p>
        <p>Ticket Type: ${ticket.ticketType.ticketName}</p>
        <p>Barcode: ${ticket.barcode}</p>
      </div>`
      )
      .join("");
  };

  return (
    <>
      <h1>Purchase History</h1>
      <TableContainer component={Paper}>
        <Table aria-label="sales data">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell onClick={() => handleSort("saleEventId")} style={{ cursor: "pointer" }}>
                Sale ID
              </TableCell>
              <TableCell onClick={() => handleSort("saleDate")} style={{ cursor: "pointer" }}>
                Date
              </TableCell>
              <TableCell onClick={() => handleSort("saleTime")} style={{ cursor: "pointer" }}>
                Time
              </TableCell>
              <TableCell onClick={() => handleSort("amount")} style={{ cursor: "pointer" }}>
                Amount
              </TableCell>
              <TableCell onClick={() => handleSort("eventName")} style={{ cursor: "pointer" }}>
                Event
              </TableCell>
              <TableCell onClick={() => handleSort("venueName")} style={{ cursor: "pointer" }}>
                Venue
              </TableCell>
              <TableCell onClick={() => handleSort("ticketTypeName")} style={{ cursor: "pointer" }}>
                Ticket Type
              </TableCell>
              <TableCell onClick={() => handleSort("price")} style={{ cursor: "pointer" }}>
                Price
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedSales
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .reverse()
              .map((sale) => (
                <React.Fragment key={sale.saleEventId}>
                  <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleClick(sale.saleEventId)}>
                        {open[sale.saleEventId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{sale.saleEventId}</TableCell>
                    <TableCell>{sale.saleDate}</TableCell>
                    <TableCell>{sale.saleTime}</TableCell>
                    <TableCell>{sale.amount}</TableCell>
                    <TableCell> {sale.ticketList[0]?.event.name}</TableCell>
                    <TableCell>
                      {sale.ticketList[0]?.event.venue.name}, {sale.ticketList[0]?.event.venue.address}, {sale.ticketList[0]?.event.venue.city}
                    </TableCell>
                    <TableCell>
                      {sale.ticketList[0]?.ticketType.ticketName} - {sale.ticketList[0]?.ticketType.description}
                    </TableCell>
                    <TableCell>${sale.ticketList[0]?.ticketType.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button onClick={() => handlePrintTickets(sale)} variant="contained" color="secondary">
                        Print Tickets
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                      <Collapse in={open[sale.saleEventId]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Table size="small" aria-label="purchase details">
                            <TableBody>
                              {sale.ticketList.map((ticket) => (
                                <TableRow key={ticket.ticketId}>
                                  <TableCell component="th" scope="row">
                                    Ticket ID: {ticket.ticketId}
                                  </TableCell>
                                  <TableCell>Barcode: {ticket.barcode}</TableCell>
                                  <TableCell>Checked In: {ticket.isChecked ? "Yes" : "No"}</TableCell>
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={sales.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

PurchaseHistory.propTypes = {
  sales: PropTypes.arrayOf(
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

export default PurchaseHistory;
