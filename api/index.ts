import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from '../backend/src/routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Support both stripped and unstripped /api routes seamlessly
app.use('/api', apiRoutes);
app.use(apiRoutes);

export default app;
