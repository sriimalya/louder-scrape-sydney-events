// lib/cron.ts
import { CronJob } from 'cron';
import { scrapeSydneyEvents } from '@/app/actions/getDataByPup';

const job = new CronJob(
  '0 */4 * * *', // Every 4 hours
  async () => {
    console.log('Running scheduled event update...');
    await scrapeSydneyEvents();
  },
  null,
  true,
  'Australia/Sydney'
);

export function startScheduler() {
  job.start();
}