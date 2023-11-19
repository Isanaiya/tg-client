import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({
    amount: "",
    eventId: "",
    ticketTypeId: "",
  });

  const [sales, setSales] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);

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
      // Fetch the updated sales data after a successful POST request
      fetchSalesData();
    } catch (error) {
      console.error("Error submitting data: ", error);
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

  return (
    <div>
      <h1>Ticket purchase</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount">Amount</label>
        <input type="text" name="amount" value={data.amount} onChange={handleChange} />
        <br />

        <label htmlFor="eventId">Event ID</label>
        <select name="eventId" value={data.eventId} onChange={handleChange}>
          <option value="">Select Event</option>
          {events.map((event) => (
            <option key={event.eventId} value={event.eventId}>
              {event.name} - {event.date}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="ticketTypeId">Ticket Type</label>
        <select name="ticketTypeId" value={data.ticketTypeId} onChange={handleChange}>
          <option value="">Select Ticket Type</option>
          {ticketTypes
            .filter((type) => type.event.eventId.toString() === data.eventId)
            .map((type) => (
              <option key={type.ticketTypeId} value={type.ticketTypeId}>
                {type.ticketName} - {type.description}
              </option>
            ))}
        </select>
        <br />
        <button type="submit">Buy</button>
      </form>

      <h2>Sales Data</h2>
      <table>
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Amount</th>
            <th>Event</th>
            <th>Venue</th>
            <th>Ticket Type</th>
            <th>Price</th>
            <th>Barcode</th>
            <th>Checked In</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) =>
            sale.ticketList.map((ticket) => (
              <tr key={ticket.ticketId}>
                <td>{sale.saleEventId}</td>
                <td>{sale.saleDate}</td>
                <td>{sale.saleTime}</td>
                <td>{sale.amount}</td>
                <td>
                  {ticket.event.name} on {ticket.event.date} at {ticket.event.time}
                </td>
                <td>
                  {ticket.event.venue.name}, {ticket.event.venue.address}, {ticket.event.venue.city}
                </td>
                <td>
                  {ticket.ticketType.ticketName} - {ticket.ticketType.description}
                </td>
                <td>${ticket.ticketType.price.toFixed(2)}</td>
                <td>{ticket.barcode}</td>
                <td>{ticket.isChecked ? "Yes" : "No"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
