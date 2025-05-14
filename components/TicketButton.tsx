'use client'

import { useState } from 'react';
import TicketModal from './TicketModal';

export default function TicketButton({ eventId }: { eventId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
      >
        GET TICKETS
      </button>

      {isModalOpen && (
        <TicketModal
          eventId={eventId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}