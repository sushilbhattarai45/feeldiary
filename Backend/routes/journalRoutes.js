import express from 'express';
import cors from 'cors';
import {getAllJournals, JournalPost} from '../controllers/journalController.js';
const router = express.Router ();

router.post ('/post', JournalPost);

router.get ('/getAll', getAllJournals);
export default router;
