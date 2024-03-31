import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import appRoutes from '@routes/index';
import { serverConfig } from '@src/server';
import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import { getEnv } from '@utils/getEnv';
console.log(config.get('db'));
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', appRoutes);

serverConfig(app, getEnv("server.port") as string);
