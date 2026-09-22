import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from '../backend/src/routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Vercel strips the /api prefix before forwarding to this handler
app.use(apiRoutes);

export default app;
