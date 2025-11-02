import express from 'express';
import cors from 'cors';
import journalRoutes from './routes/journalRoutes.js';
const app = express ();
app.use (cors ());
app.use (express.json ());
const port = 5000;

app.listen (port, () => {
  console.log (`Server is running on http://localhost:${port}`);
});

app.use ('/api/journal', journalRoutes);
