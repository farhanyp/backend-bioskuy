import corn from 'node-cron';
import { completeBookingTask, deleteExpiredPaymentsTask } from './service/cornjob/cornJob.js';

// export const completeBookingCronjob = corn.schedule('* * * * *', completeBookingTask);
// export const deleteExpiredPaymentsCronjob  = corn.schedule('* * * * *', deleteExpiredPaymentsTask);