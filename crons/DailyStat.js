import { schedule } from 'node-cron';
import User from '../models/User.js';
import Diary from '../models/Diary.js';
import Note from '../models/Note.js';

var dailyStat = schedule('59 * * * *', async () => {
  const date = new Date().toLocaleDateString();
  console.log("Starting matching algorithm", date);

});

dailyStat.start();
