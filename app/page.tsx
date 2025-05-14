// app/events/page.tsx
import { PrismaClient, Event as PrismaEvent } from '@prisma/client';
import EventCard from '@/components/EventCard';

const prisma = new PrismaClient();

export default async function EventsPage() {
let events: PrismaEvent[] = [];
  let error: string | null = null;

   try {
    events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      take: 50,
    });
  } catch (err) {
    console.error('Database error:', err);
    error = 'Failed to load events';
  }

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Upcoming Events in Sydney</h1>
      
      {error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No events found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}