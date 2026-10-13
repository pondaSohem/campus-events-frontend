import { useState } from "react";

function TicketCounter() {
    const [tickets, setTickets] = useState(1);

    return (
        <div>
            <button onClick={() => setTickets(Math.max(1, tickets - 1))}>
                -
            </button>
            <span>{tickets}</span>
            <button onClick={() => setTickets(tickets + 1)}>
                +
            </button>
        </div>
    );
}

export default TicketCounter;