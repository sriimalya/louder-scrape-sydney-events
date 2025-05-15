import { scrapeSydneyEvents } from '@/app/actions/getDataByPup';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const { newEvents, updatedEvents } = await scrapeSydneyEvents();
    return NextResponse.json({
      success: true,
      newEvents,
      updatedEvents
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Scraping failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}