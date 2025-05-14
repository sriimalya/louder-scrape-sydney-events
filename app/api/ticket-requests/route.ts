import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, optedIn, eventId } = await request.json();

    // Validate input
    if (!email || !eventId || typeof optedIn !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if event exists
    const eventExists = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!eventExists) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Create ticket request
    const ticketRequest = await prisma.ticketRequest.create({
      data: {
        email,
        optedIn,
        eventId
      },
      include: {
        event: {
          select: {
            detailsUrl: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      redirectUrl: ticketRequest.event.detailsUrl
    });

  } catch (error) {
    console.error('Error creating ticket request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}