import { useState } from 'react';
import axios from "axios";
// import './App.css'

function App() {
  const [data, setData] = useState({
    amount: "",
    eventId: "",
    ticketTypeId: ""
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value
    });
  };

  const handleSubmit = async () => {
    const ticketData = {
      ticketAmount: data.amount,
      ticketEventId: data.eventId,
      typeId: data.ticketTypeId
    };
    try {
      const response = await axios.post("localhost:8080/api/sales", {
        amount: ticketData.ticketAmount,
        ticketList: [
          {
            event: {
              eventId: ticketData.ticketEventId
            },
            ticketType: {
              ticketTypeId: ticketData.typeId
            }
          }
        ]
      }, {
        auth: {
          username: 'admin',
          password: 'admin'
        }
      })
      console.log("data", response.data);
    } catch (error) {
      console.error("Error submitting data: ", error);
    }
  };

  return (
    <div>
      <h1>Ticket purchase</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount">Amount</label>
        <input type="text" name="amount" value={data.amount} onChange={handleChange}/><br/>

        <label htmlFor="eventId">Event ID</label>
        <input type="text" name="eventId" value={data.eventId} onChange={handleChange}/><br/>

        <label htmlFor="ticketTypeId">Ticket type</label>
        <input type="text" name="ticketTypeId" value={data.ticketTypeId} onChange={handleChange}/><br/>
        <button type="submit">Buy</button>
      </form>
    </div>
  )
}

export default App
