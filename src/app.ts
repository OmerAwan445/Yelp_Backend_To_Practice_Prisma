import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import appRoutes from '@routes/index';
import { serverConfig } from '@src/server';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', appRoutes);

serverConfig(app, 3000);
