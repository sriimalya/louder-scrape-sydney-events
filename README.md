# Sydney Events Aggregator

![Event Listing Screenshot](/EventListing.png)


A Next.js web application that automatically collects and displays events from across Sydney, with built-in ticketing functionality.

## Key Features

- **Automated Event Discovery** - Scrapes event data every 4 hours
- **Beautiful UI** - Responsive design with lazy-loaded images
- **Ticket Management** - Email collection with marketing opt-in
- **Always Fresh** - Automatic updates via Vercel cron jobs
- **Reliable Storage** - PostgreSQL database with Prisma ORM

## Technology Stack

**Frontend**:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

**Backend**:
- Next.js API Routes
- Puppeteer for web scraping
- Prisma ORM with PostgreSQL (Neon)

**Infrastructure**:
- Vercel hosting
- Serverless functions
- Cron job scheduling: 0 */4 * * * (every 4 hours)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) recommended)
- Vercel account

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/sydney-events.git
cd sydney-events

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Edit .env.local with your database credentials:
DATABASE_URL="postgres://user:password@host:port/dbname"

# Running Locally:
# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

## Automatic Updates
1. The system is configured to:
2. Scrape event websites every 4 hours
3. Update existing event records
4. Add new events automatically

