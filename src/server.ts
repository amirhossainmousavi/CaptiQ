import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import subtitleRoutes from './routes/subtitles.route';

if (!process.env.AI_PROVIDER || !process.env.AI_API_KEY || !process.env.AI_MODEL) {
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', subtitleRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
