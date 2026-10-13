import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import authRoutes from './routes/auth';
import accountRoutes from './routes/account';
import todoRoutes from './routes/todo';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3339;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('MySQL API is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});