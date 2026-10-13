interface EventCardProps {
    title: string;
    location: string;
    price: number;
}

function EventCard({ title, location, price }: EventCardProps ) {
    return (
        <article>
            <h3>{title}</h3>
            <p>{location}</p>
            <p>£{price}</p>
        </article>
    );
}

export default EventCard;