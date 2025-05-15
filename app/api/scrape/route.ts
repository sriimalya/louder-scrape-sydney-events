import { scrapeSydneyEvents } from '@/app/actions/getDataByPup';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await scrapeSydneyEvents();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Scraping failed' },
      { status: 500 }
    );
  }
}