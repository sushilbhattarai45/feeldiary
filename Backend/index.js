import express from 'express';
import cors from 'cors';
import journalRoutes from './routes/journalRoutes.js';
import connectDb from './db/connectDb.js';
const app = express ();
app.use (cors ());
app.use (express.json ());
const port = 5000;
connectDb ();
app.listen (port, () => {
  console.log (`Server is running on http://localhost:${port}`);
});

app.use ('/api/journal', journalRoutes);
