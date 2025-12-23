import express from "express";
import cors from "cors";
import journalRoutes from "./routes/journalRoutes.js";
import connectDb from "./db/connectDb.js";
import AuthRoutes from "./routes/authRoutes.js";
import { preloadMoodSongs, processJournal } from "./config/geminiCOnfig.js";
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
const port = 5000;
connectDb();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use("/api/journal", journalRoutes);
app.use("/api/auth", AuthRoutes);
// main ("I spent the afternoon reading in the park. The sun was warm, and I felt completely relaxed. It’s nice to have quiet moments to myself")
//  const preSongs = await preloadMoodSongs("calm", 5);

app.post("/api/preloadMusic", (req, res) => {
  console.log("Preloading music called");
  preloadMoodSongs(5, req).then((preSongs) => {
    res.send(preSongs);
  });
});
