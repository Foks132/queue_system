import express from 'express';
import authRouter from './authRouter.js';
import windowRouter from './windowRouter.js';

export const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/window", windowRouter);