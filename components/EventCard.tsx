import { Event } from '@prisma/client';
import TicketButton from './TicketButton';

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-secondary">{event.title}</h3>
        <p className="text-gray-600 mb-1">{event.date}</p>
        <p className="text-gray-500 mb-3">{event.location}</p>
        
        {event.description && (
          <p className="text-gray-700 mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        <TicketButton eventId={event.id} />
      </div>
    </div>
  );
}